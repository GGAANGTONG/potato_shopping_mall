import { BadRequestException, Injectable } from '@nestjs/common';
import { Orders } from './entities/orders.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Goods } from 'src/goods/entities/goods.entity';
import { Stocks } from 'src/goods/entities/stocks.entity';
import { Users } from 'src/user/entities/user.entitiy';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    private readonly dataSource: DataSource,
  ) {}

  async purchase(
    userId: number,
    createOrderDto: CreateOrderDto, //포스트맨의 body,
  ) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { o_tel, o_addr, o_count, o_req, goods_id } = createOrderDto;
      const goods = await queryRunner.manager.findOne(Goods, {
        relations: ['stock'],
        where: {
          id: goods_id,
        },
      });
      if(!goods) {
        throw new BadRequestException('존재하지 않는 상품입니다.')
      }

      const count = goods.stock.count - o_count;

      if (count < 0) {
        throw new BadRequestException('재고가 없습니다.');
      }

      const user = await queryRunner.manager.findOne(Users, {
        where: {
          id: userId,
        },
      });

      if(!user) {
        throw new BadRequestException('존재하지 않는 유저입니다.')
      }

      const paying = goods.g_price * o_count;
      const afterPaidPoints = user.points - paying;
      if (afterPaidPoints < 0) {
        throw new BadRequestException('포인트가 부족합니다.');
      }

      user.points = afterPaidPoints;
      await queryRunner.manager.update(Stocks, {goods}, {count});
      await queryRunner.manager.save(Users, user);

      const newOrder = this.ordersRepository.create({
        user_id: userId,
        o_name: user.name,
        o_tel,
        o_addr,
        o_req,
        o_count,
        o_total_price: paying,
        goods_id: goods.id
      });

      await this.ordersRepository.save(newOrder);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return newOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.error(err);
      throw err;
    }
  }

}

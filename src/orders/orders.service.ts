import { BadRequestException, Injectable } from '@nestjs/common';
import { Orders } from './entities/orders.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Goods } from '../goods/entities/goods.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import { Users } from '../user/entities/user.entitiy';
import { Payments } from '../payments/entities/payments.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Payments)
    private paymentsRepository: Repository<Payments>,
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
      if (!goods) {
        throw new BadRequestException('존재하지 않는 상품입니다.');
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

      if (!user) {
        throw new BadRequestException('존재하지 않는 유저입니다.');
      }
      const paying = goods.g_price * o_count;
      const newOrder = this.ordersRepository.create({
        user_id: userId,
        o_name: user.name,
        o_tel,
        o_addr,
        o_req,
        o_count,
        o_total_price: paying,
        //goods_id 삭제함
      });
      await this.ordersRepository.save(newOrder);

      const totalpay = goods.g_price * o_count;
      const afterPaidPoints = user.points - totalpay;
      if (afterPaidPoints < 0) {
        throw new BadRequestException('포인트가 부족합니다.');
      }

      user.points = afterPaidPoints;
      await queryRunner.manager.update(Stocks, { goods }, { count });
      await queryRunner.manager.save(Users, user);

      const newPayments = this.paymentsRepository.create({
        user_id: userId,
        p_name: user.name,
        p_tel: o_tel,
        p_addr: o_addr,
        p_count: o_count,
        p_total_price: totalpay,
        paid: true,
      });

      await this.paymentsRepository.save(newPayments);
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

  // 유저별 주문 목록 전체 조회
  async findAllOrderbyUser(userId: number): Promise<Orders[]> {
    return this.ordersRepository.find({ where: { user_id: userId } });
  }

  // 전체 주문 정보 확인
  async findAllOrderbyAdmin(): Promise<Orders[]> {
    return this.ordersRepository.find();
  }

  // 상세 주문 정보 확인
  async findOneOrderbyBoth(orderId: number): Promise<Orders> {
    return this.ordersRepository.findOne({ where: { id: orderId } });
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Orders } from './entities/orders.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Goods } from '../goods/entities/goods.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import { Users } from '../user/entities/user.entitiy';
import { Payments } from '../payments/entities/payments.entity';
import { Status } from './types/order.type';
import { Point } from '../point/entities/point.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(Payments)
    private paymentsRepository: Repository<Payments>,
    private readonly dataSource: DataSource,
  ) { }

  async purchase(
    userId: number,
    createOrderDto: CreateOrderDto, // 포스트맨의 body,
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
      const afterPaidPoints = user.points - paying; // 포인트가 부족한 경우를 확인하기 위해 변경

      if (afterPaidPoints < 0) {
        throw new BadRequestException('포인트가 부족합니다.');
      }

      user.points = afterPaidPoints;
      await queryRunner.manager.update(Stocks, { goods }, { count });
      await queryRunner.manager.save(Users, user);

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

      const newPayments = this.paymentsRepository.create({
        user_id: userId,
        p_name: user.name,
        p_tel: o_tel,
        p_addr: o_addr,
        p_count: o_count,
        p_total_price: paying,
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
    try {
      const orders = await this.ordersRepository.find({ where: { user_id: userId } });
      if (!orders || orders.length === 0) {
        throw new NotFoundException('주문 정보가 없습니다.');
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 전체 주문 정보 확인
  async findAllOrderbyAdmin(): Promise<Orders[]> {
    try {
      const orders = await this.ordersRepository.find();
      if (!orders || orders.length === 0) {
        throw new NotFoundException('주문 정보가 없습니다.');
      }
      return orders;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 상세 주문 정보 확인
  async findOneOrderbyBoth(orderId: number): Promise<Orders> {
    try {
      const order = await this.ordersRepository.findOne({ where: { id: orderId } });
      if (!order) {
        throw new NotFoundException('주문 정보가 없습니다.');
      }
      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 주문 취소
  async cancelOrder(orderId: number): Promise<Orders> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId }
    });
    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    // 환불 로직
    if (order.o_status !== '주문취소') {
      const refundAmount = order.o_total_price; // 주문 취소로 인한 환불액
      const userPoint = await this.pointRepository.findOne({ where: { userId: order.user_id } });
      if (!userPoint) {
        throw new NotFoundException('사용자 포인트를 찾을 수 없습니다.');//포인트 테이블에 해당 유저 데이터가 없는 경우
      }
      userPoint.possession += refundAmount; // 포인트 테이블에 환불액 기록
      await this.pointRepository.save(userPoint);

      const user = await this.usersRepository.findOne({ where: { id: order.user_id } });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      user.points += refundAmount; // 유저의 기존 포인트에 환불액 추가
      await this.usersRepository.save(user);
    }

    order.o_status = Status.Odercancel; // 주문 상태를 '주문취소'로 변경
    return this.ordersRepository.save(order);
  }
}

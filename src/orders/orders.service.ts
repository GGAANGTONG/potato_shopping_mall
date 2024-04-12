import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Orders } from './entities/orders.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Users } from '../user/entities/user.entitiy';
import { Payments } from '../payments/entities/payments.entity';
import { Status } from './types/order.type';
import { Point } from '../point/entities/point.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { Carts } from './entities/carts.entity';
import { Goods } from '../goods/entities/goods.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import logger from '../common/log/logger';
import { OrdersDetails } from './entities/ordersdetails.entity';


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
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
    private readonly dataSource: DataSource,
  ) { }

  // 


  async purchase(
    userId: number,
    createOrderDto: CreateOrderDto,
    // 포스트맨의 body,
  ) {
    // !userId, _.isNil(userId) 걸러주는 로직 필요 + await validation(CreateOrderDto, createOrderDto)

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { carts_id } = createOrderDto;
      console.log('국밥!!!!!!!', carts_id)
      const carts = await queryRunner.manager.find(Carts, {
        where: {
          id: In(carts_id)
        },
      });
      console.log('국밥?????????', carts_id)
      if (!carts) {
        throw new BadRequestException('존재하지 않는 상품입니다.');
      }
      if (carts.length !== carts_id.length) {
        throw new BadRequestException("유효하지 않은 요청입니다.");
      }
      // for (let element of carts) {
      //   if (element.user_id !== userId) {
      //     throw new BadRequestException('유효하지 않은 요청입니다.')
      //   }
      // }

      let o_total_price: number = 0;
      for (let i = 0; i < carts.length; i++) {
        console.log('제육?????????', carts_id)
        const goods = await queryRunner.manager.findOne(Goods, {
          relations: ['stock'],
          where: {
            id: carts[i].goods_id
          }
        })
        console.log('김치?????????', carts_id)
        const count = goods.stock.count - carts[i].ct_count;
        if (count < 0) {
          const badRequestException = new BadRequestException('재고가 없습니다.')

          logger.errorLogger(badRequestException, `userId = ${userId}, createOrderDto = ${JSON.stringify(createOrderDto)}, carts = ${carts}, carts_id = ${carts_id}`)
          throw badRequestException;
        }
        o_total_price += carts[i].ct_count * carts[i].ct_price
        //Cart >> Orders 엔티티를 만들기 위해서 재고를 갱신하고 총액을 구하는 과정
      }

      const makingOrder = queryRunner.manager.create(Orders, {
        user_id: userId,
        o_total_price,
        //아마 p_status는 default(default값: false) 줘야 함
      })

      const order = await queryRunner.manager.save(Orders, makingOrder)


      for (let i = 0; i < carts.length; i++) {
        const ordersDetail = queryRunner.manager.create(OrdersDetails, {
          orders_id: order.id,
          goods_id: carts_id[i],
          od_count: carts[i].ct_count
        })

        if (!ordersDetail) {
          const internalServerErrorException = new InternalServerErrorException('알 수 없는 에러가 발생했습니다.')
          logger.fatalLogger(internalServerErrorException, `userId = ${userId}, createOrderDto = ${JSON.stringify(createOrderDto)}, order = ${order}, carts = ${carts}, carts_id = ${carts_id}`)
          throw internalServerErrorException;
        }

        await queryRunner.manager.save(OrdersDetails, ordersDetail)
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return order;
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const order = await queryRunner.manager.findOne(Orders, {
      where: { id: orderId }
    });
    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    // 환불 로직
    // 재고 반환 로직 추가
    if (order.o_status !== '주문취소') {
      const refundAmount = order.o_total_price; // 주문 취소로 인한 환불액
      const userPoint = await queryRunner.manager.findOne(Point, { where: { userId: order.user_id } });
      if (!userPoint) {
        throw new NotFoundException('사용자 포인트를 찾을 수 없습니다.');//포인트 테이블에 해당 유저 데이터가 없는 경우
      }
      userPoint.possession += refundAmount; // 포인트 테이블에 환불액 기록
      await queryRunner.manager.save(userPoint);

      const user = await queryRunner.manager.findOne(Users, { where: { id: order.user_id } });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      user.points += refundAmount; // 유저의 기존 포인트에 환불액 추가
      await queryRunner.manager.save(user);
    }

    order.o_status = Status.Odercancel; // 주문 상태를 '주문취소'로 변경
    return this.ordersRepository.save(order);
  }
}

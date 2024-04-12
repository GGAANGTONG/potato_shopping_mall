import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payments } from './entities/payments.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Point } from '../point/entities/point.entity';
import { Users } from '../user/entities/user.entitiy';
import { Orders } from '../orders/entities/orders.entity';
import { CreatePaymentDto } from '../orders/dto/create-payment.dto';
import { validation } from '../common/pipe/validationPipe';
import { OrdersDetails } from '../orders/entities/ordersdetails.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import logger from '../common/log/logger';
import { Goods } from '../goods/entities/goods.entity';
import { Status } from '../orders/types/order.type';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payments)
    private paymentsRepository: Repository<Payments>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrdersDetails)
    private ordersDetailsRepository: Repository<OrdersDetails>,
    private readonly dataSource: DataSource,
  ) { }

  // 전체적으로 추가적인 보안요소 필요
  async pay(
    userId: number,
    createPaymentDto: CreatePaymentDto // 포스트맨의 body,
  ) {
    await validation(CreatePaymentDto, createPaymentDto)
    const { orders_id } = createPaymentDto
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await queryRunner.manager.findOne(Orders, {
        where: {
          id: orders_id, user_id: userId
        }

      })

      if (!order) {
        throw new BadRequestException('존재하지 않는 주문입니다.');
      }

      const user = await queryRunner.manager.findOne(Users, {
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new BadRequestException('존재하지 않는 유저입니다.');
      }

      const ordersdetails = await queryRunner.manager.find(OrdersDetails, {
        where: {
          orders_id: order.id
        }
      })

      for (let i = 0; i < ordersdetails.length; i++) {
        const goods = await queryRunner.manager.findOne(Goods, {
          relations: ['stock'],
          where: {
            id: ordersdetails[i].goods_id
          }
        })
        const count = goods.stock.count - ordersdetails[i].od_count;
        console.log('제육!!!!!!!!!', count)
        if (count < 0) {
          const badRequestException = new BadRequestException('재고가 없습니다.')

          logger.errorLogger(badRequestException, `userId = ${userId}, createPaymentDto = ${JSON.stringify(createPaymentDto)}, ordersdetails = ${ordersdetails}, `)
          throw badRequestException;
        }

        await queryRunner.manager.update(Stocks, { id: goods.stock.id }, { count })
        //Cart >> Orders 엔티티를 만들기 위해서 재고를 갱신하고 총액을 구하는 과정
      }


      const paying = order.o_total_price
      const afterPaidPoints = user.points - paying; // 포인트가 부족한 경우를 확인하기 위해 변경



      if (afterPaidPoints < 0) {
        throw new BadRequestException('포인트가 부족합니다.');
      }

      user.points = afterPaidPoints;
      await queryRunner.manager.save(Users, user);

      const newPayments = await this.paymentsRepository.create({
        orders_id,
        user_id: userId,
        p_total_price: paying,
      });
      const returnNewPayments = await queryRunner.manager.save(Payments, newPayments);
      await queryRunner.manager.update(Orders, { user_id: userId, id: orders_id }, { p_status: true })
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return returnNewPayments
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.error(err);
      throw err;
    }

  }


  // 유저별 결제 목록 전체 조회
  async findAllOrderbyUser(userId: number): Promise<Payments[]> {
    try {
      // null,undefined,0 들어올 경우 대비 로직 추가 //완료
      const payments = await this.paymentsRepository.find({ where: { user_id: userId } });
      if (!payments || payments.length === 0) {
        throw new NotFoundException('결제 정보가 없습니다.');
      }
      return payments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 전체 결제 정보 확인
  async findAllOrderbyAdmin(): Promise<Payments[]> {
    try {
      const payments = await this.paymentsRepository.find();
      if (!payments || payments.length === 0) {
        throw new NotFoundException('결제 정보가 없습니다.');
      }
      return payments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 상세 결제 정보 확인
  async findOneOrderbyBoth(paymentsId: number): Promise<Payments> {
    try {
      const payments = await this.paymentsRepository.findOne({ where: { id: paymentsId } });
      if (!payments) {
        throw new NotFoundException('결제 정보가 없습니다.');
      }
      return payments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 결제 취소
  //트랜잭션 필요
  async cancelPay(userId: number, paymentsId: number): Promise<Payments> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!userId || userId == 0 || !paymentsId || paymentsId == 0) {
        throw new BadRequestException('잘못된 요청입니다!')
      }
      const payments = await queryRunner.manager.findOne(Payments, {
        where: { id: paymentsId, user_id: userId }
      });
      if (!payments) {
        throw new NotFoundException('결제 정보를 찾을 수 없습니다.');
      }

      // 환불 로직
      {
        const refundAmount = payments.p_total_price; // 결제 취소로 인한 환불액
        const userPoint = await queryRunner.manager.findOne(Point, { where: { userId: payments.user_id } });
        if (!userPoint) {
          throw new NotFoundException('사용자 포인트를 찾을 수 없습니다.');//포인트 테이블에 해당 유저 데이터가 없는 경우
        }


        userPoint.possession += refundAmount; // 포인트 테이블에 환불액 기록
        await this.pointRepository.save(userPoint);

        const user = await queryRunner.manager.findOne(Users, { where: { id: payments.user_id } });
        if (!user) {
          throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        user.points += refundAmount; // 유저의 기존 포인트에 환불액 추가
        await queryRunner.manager.save(user);
      }
      await queryRunner.manager.update(Orders, { user_id: userId, id: payments.orders_id }, { p_status: false, o_status: Status.PAycanceled })
      payments.p_total_price = -payments.p_total_price
      await queryRunner.manager.save(Payments, payments);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return payments;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.error(err);
      throw err;
    }

  }
}


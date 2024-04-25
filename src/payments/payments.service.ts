import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payments } from './entities/payments.entity';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import _ from 'lodash';
import { Redis } from 'ioredis';
import { RedisService } from '../redis/redis.service';
import { KakaoGeocoder } from '../common/utils/kakao-geocoder.util';

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
    @InjectRepository(Stocks)
    private stocksRepository: Repository<Stocks>,
    private redisService: RedisService,
    private readonly dataSource: DataSource,
    private kakaoGeocoder: KakaoGeocoder,  
  ) { }

  // 전체적으로 추가적인 보안요소 필요
  async pay(
    userId: number,
    createPaymentDto: CreatePaymentDto // 포스트맨의 body,
  ) {
    if (_.isNil(userId) || userId == 0) {
      const error = new BadRequestException('잘못된 요청입니다!')
      logger.errorLogger(error, `userId = ${userId}, createPaymentDto = ${createPaymentDto}`)
      throw error
    }
  
    await validation(CreatePaymentDto, createPaymentDto);
    const { orders_id } = createPaymentDto;
  
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const order = await queryRunner.manager.createQueryBuilder(Orders, 'order')
        .where('order.id = :orders_id AND order.user_id = :userId', { orders_id, userId })
        .getOne();
  
      if (!order) {
        const error = new BadRequestException('존재하지 않는 주문입니다.');
        logger.errorLogger(error, `userId = ${userId}, createPaymentDto = ${createPaymentDto}, order = ${order}`)
        throw error
      }
  
      const user = await queryRunner.manager.createQueryBuilder(Users, 'user')
        .where('user.id = :userId', { userId })
        .getOne();
  
      if (!user) {
        const error = new BadRequestException('존재하지 않는 유저입니다.');
        logger.errorLogger(error, `userId = ${userId}, createPaymentDto = ${createPaymentDto}, order = ${user}`)
        throw error
      }
  
      const details = await queryRunner.manager.createQueryBuilder(OrdersDetails, 'details')
        .where('details.orders_id = :orders_id', { orders_id })
        .getMany();
    
        //redlock 
        const client = this.redisService.getClient()
        const redlock = this.redisService.redlock(client)
      
    
        const lock = await redlock.acquire([`transaction: user_id = ${userId} & order_id = ${order.id}`], 6000)
        try{
        //트랜잭션
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {

          const paymentAmount = order.o_total_price;
          console.log('paymentAmount?', paymentAmount)
          const newPoints = user.points - paymentAmount;
      
          if (newPoints < 0) {
            const error = new BadRequestException('포인트가 부족합니다.');
            logger.errorLogger(error, `userId = ${userId}, createPaymentDto = ${createPaymentDto}`) 
            throw error
          }

          const destination = await this.kakaoGeocoder.getCoordinates(order.o_addr)
          console.log('국밥1-1', destination)
          const storage = await this.kakaoGeocoder.getClosestStorage(destination)
          console.log('국밥1-2', storage)
      for (const detail of details) {
        const goods = queryRunner.manager.createQueryBuilder(Goods, 'goods')
        const stocks = await queryRunner.manager.createQueryBuilder(Stocks, 'stocks')
        // , 'racks.*', 'storage.*'
        .select(['stocks.*', 'goods.*'])
        .leftJoin('goods', 'goods', 'stocks.goods_id = goods.id')
        .leftJoin('racks', 'racks', 'stocks.rack_id = racks.id')
        .leftJoin('storage', 'storage', 'racks.storage_id = storage.id')
        .where('goods.id = :goodsId', { goodsId: detail.goods_id })
        .andWhere('storage.id = :storageId', { storageId: storage.id })
        .getRawOne();
        console.log('국밥1-4', stocks)
        
        if (!goods || stocks.count < detail.od_count) {
          const error = new BadRequestException('재고가 없습니다.');
          logger.errorLogger(error, `userId = ${userId}, goodsId = ${detail.goods_id}`);
          throw error;
        }
  
        const newStockCount = stocks.count - detail.od_count;
        await queryRunner.manager.createQueryBuilder()
          .update(Stocks)
          .set({ count: newStockCount })
          .where('id = :stockId', { stockId: stocks.id })
          .execute();
      }
      console.log('국밥ㅇ')
      await queryRunner.manager.createQueryBuilder()
        .update(Users)
        .set({ points: newPoints })
        .where('id = :userId', { userId })
        .execute();
        console.log('국밥?')
      const newPayments = queryRunner.manager.create(Payments, {
        orders_id,
        user_id: userId,
        p_total_price: paymentAmount,
      });
      console.log('국밥ㅁ')
      const returnNewPayments = await queryRunner.manager.save(Payments, newPayments);
      console.log('국밥ㅁ-1', returnNewPayments)
      await queryRunner.manager.update(Orders, { user_id: userId, id: orders_id }, { p_status: true })
      console.log('국밥ㅂ')

      await queryRunner.commitTransaction();
      await queryRunner.release();
      console.log('국밥ㄹ')
      return returnNewPayments;
    } catch(err) {
      console.dir(err)
      // const error =  new Error('트랜잭션 에러가 발생하였습니다.')
      // logger.errorLogger(error, `error detail =${console.dir(error)}`)
      // throw error;
      }
      } catch (err) {
        // const fatalError = new InternalServerErrorException('동시성 제어 관련 에러가 발생했습니다.')
        // logger.fatalLogger(fatalError, `userId = ${userId}, createPaymentDto = ${createPaymentDto}, error detail = ${console.dir(fatalError)}`)
        // throw fatalError;
      } finally {
        if(lock) {
          await lock.release()
        }
      }
    } catch(err) {
      // const fatalError = new InternalServerErrorException('알 수 없는 에러가 발생했습니다.')
      // logger.fatalLogger(fatalError, `userId = ${userId}, createPaymentDto = ${createPaymentDto}, error detail = ${console.dir(fatalError)}`)
      // throw fatalError;
    }
    }


  // 유저별 결제 목록 전체 조회
  async findAllOrderbyUser(userId: number): Promise<Payments[]> {
    if (_.isNil(userId) || userId == 0) {
      const error = new BadRequestException('잘못된 요청입니다!') 
      logger.errorLogger(error, `userId = ${userId}`)
      throw error
    }
  
    try {
      const payments = await this.paymentsRepository
        .createQueryBuilder("payment")
        .where("payment.user_id = :userId", { userId })
        .getMany();
  
      if (!payments || payments.length === 0) {
        const error = new NotFoundException('결제 정보가 없습니다.');
        logger.errorLogger(error, `userId = ${userId}, payments = ${payments}`) 
        throw error;
      }
      return payments;
    } catch (error) {
      const fatalError = new InternalServerErrorException('알 수 없는 에러가 발생했습니다.');
      logger.fatalLogger(fatalError, `userId = ${userId}`);
      throw fatalError;
    }
  }
  

  // 전체 결제 정보 확인
  async findAllOrderbyAdmin(): Promise<Payments[]> {
    try {
      const payments = await this.paymentsRepository.find();
      if (!payments || payments.length === 0) {
        const error = new NotFoundException('결제 정보가 없습니다.');
        logger.errorLogger(error, `payments = ${payments}`)
        throw error;
      }
      return payments;
    } catch (error) {
      const fatalError = new InternalServerErrorException('알 수 없는 에러가 발생했습니다.')
      logger.fatalLogger(fatalError, `parameter = none`)
      throw fatalError;
    }
  }

  // 상세 결제 정보 확인
  async findOneOrderbyBoth(paymentsId: number): Promise<Payments> {
    if (_.isNil(paymentsId) || paymentsId == 0) {
      const error = new BadRequestException('잘못된 요청입니다!') 
      logger.errorLogger(error, `paymentsId = ${paymentsId}`)
      throw error
    }
  
    try {
      // 쿼리 빌더를 사용하여 결제 정보 조회
      const payments = await this.paymentsRepository
        .createQueryBuilder("payment")
        .where("payment.id = :id", { id: paymentsId })
        .getOne();
  
      if (!payments) {
        const error = new NotFoundException('결제 정보가 없습니다.');
        logger.errorLogger(error, `paymentsId = ${paymentsId}, payments = ${payments}`) 
        throw error;
      }
      return payments;
    } catch (error) {
      const fatalError = new InternalServerErrorException('알 수 없는 에러가 발생했습니다.');
      logger.fatalLogger(fatalError, `paymentsId = ${paymentsId}`);
      throw fatalError;
    }
  }
  

  // 결제 취소
  //트랜잭션 필요
  async cancelPay(userId: number, paymentsId: number): Promise<Payments> {

    if (_.isNil(paymentsId) || paymentsId == 0 || _.isNil(userId) || userId == 0) {
      const error = new BadRequestException('잘못된 요청입니다!')
      logger.errorLogger(error, `paymentsId = ${paymentsId}, userId = ${userId}`)
      throw error
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!userId || userId == 0 || !paymentsId || paymentsId == 0) {
        const error = new BadRequestException('잘못된 요청입니다!')
        logger.errorLogger(error, `userId = ${userId}, paymentsId = ${paymentsId}`)
        throw error
      }
      const payments = await queryRunner.manager.findOne(Payments, {
        where: { id: paymentsId, user_id: userId }
      });
      if (!payments) {
        const error = new NotFoundException('결제 정보를 찾을 수 없습니다.');
        logger.errorLogger(error, `userId = ${userId}, paymentsId = ${paymentsId}, payments = ${payments}`)
        throw error
      }

      // 환불 로직

      const refundAmount = payments.p_total_price; // 결제 취소로 인한 환불액
      const userPoint = await queryRunner.manager.findOne(Point, { where: { userId: payments.user_id } });
      if (!userPoint) {
        const error = new NotFoundException('사용자 포인트를 찾을 수 없습니다.');
        logger.errorLogger(error, `userId = ${userId}, paymentsId = ${paymentsId}, payments = ${payments}, userPoint = ${userPoint}`)
        throw error
      }


      userPoint.possession += refundAmount; // 포인트 테이블에 환불액 기록
      await queryRunner.manager.save(Point, userPoint);

      const user = await queryRunner.manager.findOne(Users, { where: { id: payments.user_id } });
      if (!user) {
        const error = new NotFoundException('사용자를 찾을 수 없습니다.');
        logger.errorLogger(error, `userId = ${userId}, paymentsId = ${paymentsId}, payments = ${payments}, user = ${user}`)
        throw error
      }
      user.points += refundAmount; // 유저의 기존 포인트에 환불액 추가
      await queryRunner.manager.save(Users, user);

      await queryRunner.manager.update(Orders, { user_id: userId, id: payments.orders_id }, { p_status: false, o_status: Status.PayCanceled })
      payments.p_total_price = -payments.p_total_price

      const order = await queryRunner.manager.findOne(Orders, {
        where: { user_id: userId, id: payments.orders_id }
      })
      if (order.o_status == Status.PayCanceled) {
        const error = new BadRequestException('이미 취소된 주문입니다.');
        logger.errorLogger(error, `userId = ${userId}, paymentsId = ${paymentsId}, payments = ${payments}, order = ${order}`)
        throw error
      }

      await queryRunner.manager.save(Payments, payments);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return payments;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      const fatalError = new InternalServerErrorException('알 수 없는 에러가 발생했습니다.')
      logger.fatalLogger(fatalError, `userId = ${userId}, paymentsId = ${paymentsId}`)
      throw fatalError;
    }

  }

  /**
   * 주소로 좌표찾기
   * @param address 
   * @returns 
   */
  async getCoordinates(address: string): Promise<{lat: number, lng: number}> {
    const coordinates = await this.kakaoGeocoder.getCoordinates(address);
    let lat = coordinates.lat;
    let lng = coordinates.lng;
    return coordinates;
  }

}


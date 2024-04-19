##src/redis/redis.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedisService {
  private readonly client: Redis;
  // private readonly clients: Redis[];
  // private readonly maxClients: number;
  constructor(
    private readonly configService: ConfigService,
    // maxClients: number,
    // options: RedisOptions
  ) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    })
    // this.maxClients = maxClients;
    // this.clients = [];
  }

 getClient(): Redis {
    return this.client;
  }

redlock(client): Redlock {
  const redlock = new Redlock(
    [client],
    {
      //시간 동기화
      driftFactor: 0.01,
      //재시도 횟수
      retryCount: 10,
      //재시도 간 간격
      retryDelay: 200,
      //최대 딜레이 시간
      retryJitter:300,
      //잠금 만료 연장 하는 시점
      automaticExtensionThreshold: 100,
    }
  )
  return redlock
}
}


##src/payments/payments.service.ts - pay
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
import { RedisService } from '../redis/redis.service';
import Redlock from 'redlock';

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
    private readonly redisService: RedisService
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
    await validation(CreatePaymentDto, createPaymentDto)
    const { orders_id } = createPaymentDto
    const queryRunner = this.dataSource.createQueryRunner();

    const order = await queryRunner.manager.findOne(Orders, {
      where: {
        id: orders_id, user_id: userId
      }

    })

    if (!order) {
      const error = new BadRequestException('존재하지 않는 주문입니다.');
      logger.errorLogger(error, `userId = ${userId}, createPaymentDto = ${createPaymentDto}, order = ${order}`) 
      throw error
    }

    const user = await queryRunner.manager.findOne(Users, {
      where: {
        id: userId,
      },
    });

    if (!user) {
      const error = new BadRequestException('존재하지 않는 유저입니다.');
      logger.errorLogger(error, `userId = ${userId}, createPaymentDto = ${createPaymentDto}, order = ${user}`) 
      throw error
    }

    const ordersdetails = await queryRunner.manager.find(OrdersDetails, {
      where: {
        orders_id: order.id
      }
    })
    //redlock 
    const client = this.redisService.getClient()
    const redlock = this.redisService.redlock(client)
  

    const lock = await redlock.acquire([`transaction: user_id = ${userId} & order_id = ${order.id}`], 6000)
    try{
    //트랜잭션
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < ordersDetails.length; i++) {
        const goods = await queryRunner.manager.findOne(Goods, {
          relations: ['stock'],
          where: {
            id: ordersDetails[i].goods_id
          }
        })
        
        const count = goods.stock.count - ordersDetails[i].od_count;
        if (count < 0) {
          const error = new BadRequestException('재고가 없습니다.')

          logger.errorLogger(error, `userId = ${userId}, createPaymentDto = ${JSON.stringify(createPaymentDto)}, ordersDetails = ${ordersDetails}`)
          throw error;
        }

        await queryRunner.manager.update(Stocks, { id: goods.stock.id }, { count })
        //Cart >> Orders 엔티티를 만들기 위해서 재고를 갱신하고 총액을 구하는 과정
      }

      const paying = order.o_total_price
      const afterPaidPoints = user.points - paying; // 포인트가 부족한 경우를 확인하기 위해 변경

      if (afterPaidPoints < 0) {
        const error = new BadRequestException('포인트가 부족합니다.');
        logger.errorLogger(error, `userId = ${userId}, createPaymentDto = ${createPaymentDto}`) 
        throw error
      }

      user.points = afterPaidPoints;
      await queryRunner.manager.save(Users, user);

      const newPayments = queryRunner.manager.create(Payments, {
        orders_id,
        user_id: userId,
        p_total_price: paying,
      });
      const returnNewPayments = await queryRunner.manager.save(Payments, newPayments);

      await queryRunner.manager.update(Orders, { user_id: userId, id: orders_id }, { p_status: true })

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return returnNewPayments

    } catch(err) {
    const error =  new Error('트랜잭션 에러가 발생하였습니다.')
    logger.errorLogger(error, `error detail =${console.dir(error)}`)
    throw error;
    }
    } catch (err) {
      const fatalError = new InternalServerErrorException('동시성 제어 관련 에러가 발생했습니다.')
      logger.fatalLogger(fatalError, `userId = ${userId}, createPaymentDto = ${createPaymentDto}, error detail = ${console.dir(fatalError)}`)
      throw fatalError;
    } finally {
      if(lock) {
        await lock.release()
      }
    }
  } catch(err) {
    const fatalError = new InternalServerErrorException('알 수 없는 에러가 발생했습니다.')
    logger.fatalLogger(fatalError, `userId = ${userId}, createPaymentDto = ${createPaymentDto}, error detail = ${console.dir(fatalError)}`)
    throw fatalError;
  }
  }


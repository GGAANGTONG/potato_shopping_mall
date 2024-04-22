import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from './entities/payments.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Users } from '../user/entities/user.entitiy';
import { Point } from '../point/entities/point.entity';
import { Orders } from '../orders/entities/orders.entity';
import { OrdersDetails } from '../orders/entities/ordersdetails.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import { RedisService } from 'src/redis/redis.service';
@Module({
    imports: [TypeOrmModule.forFeature([Payments, Users, Point, Orders, OrdersDetails, Stocks])],
    providers: [PaymentsService,RedisService],
    controllers: [PaymentsController],
    exports: [PaymentsService,RedisService],
})
export class PaymentsModule { }
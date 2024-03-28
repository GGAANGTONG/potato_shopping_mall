import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carts } from './order.entities/carts.entity';
import { Orders } from './order.entities/orders.entity';
import { Ordersdetails } from './order.entities/ordersdetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carts, Orders, Ordersdetails])],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule { }

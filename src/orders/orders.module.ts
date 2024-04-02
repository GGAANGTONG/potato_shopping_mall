import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carts } from './entities/carts.entity';
import { Orders } from './entities/orders.entity';
import { OrdersDetails } from './entities/ordersdetails.entity';
import { Goods } from '../goods/entities/goods.entity';
import { Categories } from '../goods/entities/categories.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import { Reviews } from './entities/review.entity';
import { Users } from '../user/entities/user.entitiy';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Carts,
      Orders,
      OrdersDetails,
      Goods,
      Categories,
      Stocks,
      Reviews,
      Users,
    ]),
  ],
  providers: [OrdersService, ReviewService],
  controllers: [OrdersController, ReviewController],
})
export class OrdersModule { }

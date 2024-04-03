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
import { CartService } from './carts.service';
import { CartController } from './carts.controller';
import { Payments } from '../payments/entities/payments.entity';
import { Like } from 'src/like/entities/like.entity';

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
      Payments,
      Like,

    ]),
  ],
  providers: [OrdersService, ReviewService, CartService],
  controllers: [OrdersController, ReviewController, CartController],
})
export class OrdersModule {}

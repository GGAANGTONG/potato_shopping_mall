import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Carts } from "./entities/carts.entity";
import { Orders } from "./entities/orders.entity";
import { Ordersdetails } from "./entities/ordersdetails.entity";
import { Goods } from "src/goods/entities/goods.entity";
import { Categories } from "src/goods/entities/categories.entity";
import { Stocks } from "src/goods/entities/stocks.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Carts,
      Orders,
      Ordersdetails,
      Goods,
      Categories,
      Stocks,
    ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}

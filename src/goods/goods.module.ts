import { Module } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { GoodsController } from "./goods.controller";
import { Goods } from "./entities/goods.entity";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { Categories } from "./entities/categories.entity";
import { Stocks } from "./entities/stocks.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "src/orders/entities/orders.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Goods, Categories, Stocks, Orders])],
  controllers: [GoodsController, CategoriesController],
  providers: [GoodsService, CategoriesService],
})
export class GoodsModule {}

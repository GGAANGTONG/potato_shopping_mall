import { Module } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { GoodsController } from "./goods.controller";
import { Categories } from "./entities/categories.entity";
import { Goods } from "./entities/goods.entity";
import { Stocks } from "./entities/stocks.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports : [
    TypeOrmModule.forFeature([Goods, Categories, Stocks])
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}

import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { Goods } from './entities/goods.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Categories } from './entities/categories.entity';
import { Stocks } from './entities/stocks.entity';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from '../orders/entities/orders.entity';
import { Like } from 'src/like/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goods, Categories, Stocks, Orders, Like]),
  ],
  controllers: [GoodsController, CategoriesController, StocksController],
  providers: [GoodsService, CategoriesService, StocksService],
  exports: [GoodsService],
})
export class GoodsModule {}

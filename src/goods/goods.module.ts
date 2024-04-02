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
import { Orders } from 'src/orders/entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goods, Categories, Stocks, Orders])],
  controllers: [GoodsController, CategoriesController, StocksController],
  providers: [GoodsService, CategoriesService, StocksService],
})
export class GoodsModule {}

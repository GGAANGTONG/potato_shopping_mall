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
import { Storage } from '../storage/entities/storage.entity';
import { Racks } from '../storage/entities/rack.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from '../orders/entities/orders.entity';
import { Like } from '../like/entities/like.entity';
import { S3FileService } from '../common/utils/s3_fileupload';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Goods,
      Categories,
      Stocks,
      Orders,
      Like,
      Storage,
      Racks,
    ]),
  ],
  controllers: [GoodsController, CategoriesController, StocksController],
  providers: [GoodsService, CategoriesService, StocksService, S3FileService],
  exports: [GoodsService, S3FileService],
})
export class GoodsModule {}

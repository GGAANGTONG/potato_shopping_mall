import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './entities/storage.entity';
import { Racks } from './entities/rack.entity';
import { Goods } from '../goods/entities/goods.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import { RacksController } from './rack.controller';
import { RackService } from './rack.service';
import { KakaoGeocoder } from '../common/utils/kakao-geocoder.util';

@Module({
  imports: [TypeOrmModule.forFeature([Storage, Racks, Goods, Stocks])],
  controllers: [StorageController, RacksController],
  providers: [StorageService, RackService, KakaoGeocoder],
  exports: [StorageService, RackService],
})
export class StorageModule {}

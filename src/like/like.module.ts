import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { UsersModule } from 'src/user/users.module';
import { GoodsModule } from 'src/goods/goods.module';
import { Goods } from '../goods/entities/goods.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import { Categories } from '../goods/entities/categories.entity';
import { Users } from '../user/entities/user.entitiy';
import { Point } from '../point/entities/point.entity';
import { GoodsService } from 'src/goods/goods.service';
import { UserService } from 'src/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
<<<<<<< HEAD
import { Storage } from '../storage/entities/storage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Goods, Users, Stocks, Categories, Point, Storage]),
=======
import { Racks } from '../storage/entities/rack.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Goods, Users, Stocks, Categories, Point, Racks]),
>>>>>>> e6bda418c516e1276ef3dede000d3fc89d6358c9
    UsersModule,
    GoodsModule,
    HttpModule,
  ], // This registers the repository
  providers: [LikeService, UserService, JwtService, GoodsService],
  controllers: [LikeController],
})
export class LikeModule {}

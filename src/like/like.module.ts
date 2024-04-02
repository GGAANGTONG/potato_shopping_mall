import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./entities/like.entity";
import { UsersModule } from "src/user/users.module";
import { GoodsModule } from "src/goods/goods.module";
import { Goods } from "src/goods/entities/goods.entity";
import { Users } from "src/user/entities/user.entitiy";
// import { GoodsService } from "src/goods/goods.service";
import { UserService } from "src/user/users.service";
import { JwtService } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Goods, Users]),
    UsersModule,
    GoodsModule,
    HttpModule,
  ], // This registers the repository
  providers: [LikeService, UserService, JwtService],
  // GoodsService
  controllers: [LikeController],
})
export class LikeModule {}

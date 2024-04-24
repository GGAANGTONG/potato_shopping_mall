import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { configModuleValidationSchema } from './configs/env_validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './configs/typeOrmModuleOption';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './user/users.module';
import { GoodsModule } from './goods/goods.module';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { PointModule } from './point/point.module';
import { RedisModule } from './redis/redis.module';
import { BoardsModule } from './boards/boards.module';
import { StorageModule } from './storage/storage.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UsersModule,
    OrdersModule,
    PaymentsModule,
    UsersModule,
    GoodsModule,
    LikeModule,
    PointModule,
    RedisModule,
    BoardsModule,
    StorageModule,
    ElasticsearchModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

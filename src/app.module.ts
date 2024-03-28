import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { configModuleValidationSchema } from 'configs/env_validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from 'configs/typeOrmModuleOption';
import { OrdersModule } from './orders/orders.module';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: configModuleValidationSchema
  }),

  TypeOrmModule.forRootAsync(
    typeOrmModuleOptions
  ),

  OrdersModule,
  PaymentsModule,
  UsersModule,
  GoodsModule,
],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }

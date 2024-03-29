import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { configModuleValidationSchema } from "configs/env_validation";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmModuleOptions } from "configs/typeOrmModuleOption";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { UsersModule } from "./user/users.module";
import { GoodsModule } from "./goods/goods.module";
import { AuthModule } from "./auth/auth.module";

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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

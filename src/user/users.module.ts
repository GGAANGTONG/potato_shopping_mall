import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./users.service";
import { Users } from "./entities/user.entitiy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        signOptions: { expiresIn: "1h" },
        secret: config.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users]),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}

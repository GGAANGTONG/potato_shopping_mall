import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { Users } from 'src/user/entities/user.entitiy';
import { UsersModule } from 'src/user/users.module';
import { UserService } from 'src/user/users.service';
import { HttpModule } from '@nestjs/axios';
import { Point } from 'src/point/entities/point.entity';
import { PointModule } from 'src/point/point.module';
import { KakaoStrategy } from './kakao.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Point]),
    UsersModule,
    HttpModule,
    PointModule,
  ],
  providers: [JwtStrategy, UserService, HttpModule, KakaoStrategy],
  controllers: [],
  exports: [KakaoStrategy]
})
export class AuthModule {}

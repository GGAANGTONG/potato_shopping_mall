import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { Users } from 'src/user/entities/user.entitiy';
import { UsersModule } from 'src/user/users.module';
import { UserService } from 'src/user/users.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users]),
    UsersModule,
    HttpModule,
  ],
  providers: [JwtStrategy, UserService, HttpModule],
  controllers: [],
})
export class AuthModule {}

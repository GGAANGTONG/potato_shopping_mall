import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { HttpModule } from '@nestjs/axios';
import { Users } from 'src/user/entities/user.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Point } from 'src/point/entities/point.entity';
import { S3FileService } from '../common/utils/s3_fileupload';
import { RedisService } from '../redis/redis.service';
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Point]),
    HttpModule],
  controllers: [OauthController],
  providers: [OauthService, UserService, S3FileService, RedisService],
})
export class OauthModule {}

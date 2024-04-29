import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { Users } from './entities/user.entitiy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Point } from '../point/entities/point.entity';
import { Boards } from '../boards/entities/boards.entity';
import { Comments } from '../boards/entities/comments.entity';
import { S3FileService } from '../common/utils/s3_fileupload';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Point,Boards,Comments]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        signOptions: { expiresIn: '36h' },
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService,S3FileService,RedisService],
  exports: [UserService,S3FileService,RedisService],
})
export class UsersModule {}

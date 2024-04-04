import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { Users } from './entities/user.entitiy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Point } from '../point/entities/point.entity';
import { PointModule } from '../point/point.module';
import { S3FileService } from '../common/utils/s3_fileupload';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Point]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        signOptions: { expiresIn: '1h' },
        secret: config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Point]),
    HttpModule,
    PointModule,
  ],
  controllers: [UserController],
  providers: [UserService,S3FileService],
  exports: [UserService,S3FileService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { Users } from './entities/user.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Boards } from './entities/boards.entity';
import { Users } from 'src/user/entities/user.entitiy';
import { Comments } from './entities/comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3FileService } from 'src/common/utils/s3_fileupload';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boards, Comments, Users])
  ],
  controllers: [BoardsController],
  providers: [BoardsService, S3FileService],
})
export class BoardsModule {}

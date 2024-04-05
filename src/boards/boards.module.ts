import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Boards } from './entities/boards.entity';
import { Users } from '../user/entities/user.entitiy';
import { Comments } from './entities/comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3FileService } from '../common/utils/s3_fileupload';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boards, Comments, Users])
  ],
  controllers: [BoardsController, CommentsController],
  providers: [BoardsService, CommentsService, S3FileService],
})
export class BoardsModule {}

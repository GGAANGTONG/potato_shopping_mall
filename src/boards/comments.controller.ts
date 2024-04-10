import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    const userId = req.user.id
    return this.commentsService.create(userId, createCommentDto);
  }

  //유저용, 해당 유저만 볼 수 있도록 로직을 더 넣어야 하나
  @Get()
  findAllByUserId(@Request() req, @Query() board_id?: number) {
    const userId = req.user.id
    return this.commentsService.findAllByUserId(userId, board_id)
  }


  //admin용(rolesGuard)
  //goods id, category id로 검색하고 싶은 경우가 생기지 않을까?

  @Get()
  findAll() {
    return this.commentsService.findAll()
  }

 
  @Patch(':id')
  update(@Request() req, @Body() updateCommentDto: UpdateCommentDto) {
    const userId = req.user.id
    return this.commentsService.update(userId, updateCommentDto);
  }

  @Delete(':comment_id')
  remove(@Request() req, @Param('comment_id') commentId: number) {
    const userId = req.user.id
    return this.commentsService.remove(userId, commentId);
  }
}

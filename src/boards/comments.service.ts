import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { validation } from '../common/pipe/validationPipe';
import { Comments } from './entities/comments.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comments) private readonly commentsRepository: Repository<Comments>) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    if(!userId || userId == 0) {
      throw new BadRequestException('잘못된 요청입니다!')
    }

    await validation(CreateCommentDto, createCommentDto)

    const {board_id, content} = createCommentDto

    const newComment = this.commentsRepository.create({
      user_id: userId,
      board_id,
      content
    })

    await this.commentsRepository.save(newComment)

    return newComment;
  }

  
  async findAllByUserId(userId: number, board_id?: number) {
    if(!userId || userId == 0) {
      throw new BadRequestException('잘못된 요청입니다!')
    }
    if(!_.isNil(board_id)) {
     const comments = await this.commentsRepository.find({
        where: {
          user_id: userId,
          board_id
        }
      })

      return comments;

    } else if(_.isNil(board_id)) {
     const comments = await this.commentsRepository.findBy({user_id: userId})

     if(!comments) {
      throw new BadRequestException('댓글이 존재하지 않습니다.')
     }
     return comments;

    } else {
      throw new InternalServerErrorException('서버에서 에러가 발생했습니다.')
    }
  }

  async findAll() {
    const comments = await this.commentsRepository.find()

    if(!comments) {
      throw new BadRequestException('댓글이 존재하지 않습니다.')
    }

    return comments 
  }


  async update(userId: number, updateCommentDto: UpdateCommentDto) {
    
    if(!userId || userId == 0) {
      throw new BadRequestException('잘못된 요청입니다!')
    }
  
      await validation(UpdateCommentDto, updateCommentDto)

      const {board_id, content} = updateCommentDto

      const comment = await this.commentsRepository.findOne({
        where: {
        user_id: userId,
        board_id
        }
      })

      if(!comment) {
        throw new BadRequestException('댓글이 존재하지 않습니다.')
      }

      await this.commentsRepository.update({user_id: userId, board_id}, {content})

      const updated = {
        ...comment,
        content
      }
    return {
      message: '댓글이 수정되었습니다.',
      data: updated
    
    }
  }

  async remove(userId: number, commentId: number) {
    if(!userId || !commentId || userId == 0 || commentId == 0) {
      throw new BadRequestException('잘못된 요청입니다!')
    }


    const comment = await this.commentsRepository.findOne({
      where: {
      id: commentId,
      user_id: userId
      }
    })

    if(!comment) {
      throw new BadRequestException('댓글이 존재하지 않습니다.')
    }

    await this.commentsRepository.delete(comment)

    return {
      message: '댓글이 삭제되었습니다.',
      data: comment
    }
  }
}

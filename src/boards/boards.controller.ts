import { Body, Controller, Post, UseInterceptors, Request, UploadedFile, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResizeImagePipe } from '../common/pipe/resize-image.pipe';
import { UpdateBoardDto } from './dto/update-board.dto';
import logger from '../common/log/logger';
import { AuthGuard } from '@nestjs/passport';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile(new ResizeImagePipe(400, 400)) file: Express.Multer.File, @Request() req, @Body() createBoardDto:CreateBoardDto) {
    
    const userId = req.user.id 
    logger.traceLogger(`입력 정보 = file: ${file} & req.user: ${JSON.stringify(req.user)} & createBoardDto: ${JSON.stringify(createBoardDto)}`, 'Board.controller - create')

    return this.boardsService.create(file, userId, createBoardDto)
  }

  //어드민 전용 Role = admin Only
  @Get()
  findAll() {
    logger.traceLogger(`입력 정보 = none`, 'Board.controller - findAll')
  return this.boardsService.findAll();
  }

  //어드민은 다른 유저 정보를 입력하면 볼 수 있게 할까?
  @Get('QnAs')
  findAllByUserId(@Request() req) {
  const userId = req.user.id
  logger.traceLogger(`입력 정보 = req.user: ${JSON.stringify(req.user)}`, 'Board.controller - findAllByUserId')
  return this.boardsService.findAllByUserId(userId)
  }

  //어드민말고는 userId 관련해서 유효성 제약을 걸어야 할까?
  @Get('QnA')
  findOneByBoardId(@Request() req,@Param() board_id: number) {
  const userId = req.user.id

  logger.traceLogger(`입력 정보 = req.user: ${JSON.stringify(req.user)} & board_id: ${board_id}`, 'Board.controller - findOneByBoardId')
  return this.boardsService.findOneByBoardId(userId, board_id)
  }

  @Patch()
  update(@UploadedFile(new ResizeImagePipe(400, 400)) file: Express.Multer.File, @Request() req, @Body() updateBoardDto: UpdateBoardDto) {
    const userId = req.user.id
    logger.traceLogger(`입력 정보 = file: ${file} & req.user: ${JSON.stringify(req.user)} & createBoardDto: ${JSON.stringify(updateBoardDto)}`, 'Board.controller - update')
    return this.boardsService.update(file, userId, updateBoardDto)
  }
  
  //어드민은 그냥 다 삭제할 수 있도록 해둘까?
  @UseGuards(AuthGuard('jwt'))
  @Delete(':board_id')
  remove(@Request() req, @Param() params) {
    const userId = req.user.id
    const board_id = params.board_id
    logger.traceLogger(`입력 정보 = req.user: ${JSON.stringify(req.user)} & board_id: ${JSON.stringify(board_id)}`, 'Board.controller - remove')
    console.log('국밥1', board_id)
    return this.boardsService.remove(userId, board_id)
  }
}

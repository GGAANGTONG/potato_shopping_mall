import { Controller } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile(new ResizeImagePipe(400, 400)) file: Express.Multer.File, @Request() req, @Body() createBoardDto:CreateBoardDto) {
    
    const userId = req.user.id 

    return this.boardsService.create(file, userId, createBoardDto)
  }

  //어드민 전용 Role = admin Only
  @Get()
  findAll() {
  return this.boardsService.findAll();
  }

  //어드민은 다른 유저 정보를 입력하면 볼 수 있게 할까?
  @Get('QnAs')
  findAllByUserId(@Request() req) {
  const userId = req.user.id
  return this.boardsService.findAllByUserId(userId)
  }

  //어드민말고는 userId 관련해서 유효성 제약을 걸어야 할까?
  @Get('QnA')
  findOneByBoardId(@Request() req,@Param() board_id: number) {
  const userId = req.user.id
  return this.boardsService.findOneByBoardId(userId, board_id)
  }

  @Patch()
  update(@UploadedFile(new ResizeImagePipe(400, 400)) file: Express.Multer.File, @Request() req, @Body() updateBoardDto: UpdateBoardDto) {
    const userId = req.user.id
    return this.boardsService.update(file, userId, updateBoardDto)
  }
  
  //어드민은 그냥 다 삭제할 수 있도록 해둘까?
  @Delete(':board_id')
  remove(@Request() req, @Param() board_id: number) {
    const userId = req.user.id
    return this.boardsService.remove(userId, board_id)
  }
}

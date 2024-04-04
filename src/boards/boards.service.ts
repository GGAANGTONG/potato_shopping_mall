import { UploadedFile, Body, Param, Request } from "@nestjs/common";
import { ResizeImagePipe } from "src/common/pipe/resize-image.pipe";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { Boards } from "./entities/boards.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export class BoardsService {
  constructor(@InjectRepository(Boards) private readonly boardsRepository: Repository<Boards>) {}

  async create(file: Express.Multer.File, userId, createBoardDto:CreateBoardDto) {
    
  // const newBoard = this.boardsRepository.create({file, userId, createBoardDto})

    return
  }

  //어드민 전용 Role = admin Only
  async findAll() {
  return this.boardsRepository.find();
  }

  //어드민은 다른 유저 정보를 입력하면 볼 수 있게 할까?
  
  async findAllByUserId(userId: number) {

  // return this.boardsRepository.find(userId)
  }

  //어드민말고는 userId 관련해서 유효성 제약을 걸어야 할까?
  
  async findOneByBoardId(userId: number, board_id: number) {

  // return this.boardsRepository.findOne(userId, board_id)
  }

  
  async update(userId: number, updateBoardDto: UpdateBoardDto) {

    return this.boardsRepository.update(userId, updateBoardDto)
  }
  
  async remove(userId: number, board_id: number) {

    // return this.boardsRepository.delete(userId, board_id)
  }
}

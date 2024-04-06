import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { Boards } from "./entities/boards.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { validation } from "../configs/validationPipe";
import { BadRequestException } from "@nestjs/common";
import { S3FileService } from "../common/utils/s3_fileupload";

export class BoardsService {
  constructor(@InjectRepository(Boards) private readonly boardsRepository: Repository<Boards>,
  private readonly s3FileService: S3FileService,
  ) {}

  async create(file: Express.Multer.File, userId, createBoardDto:CreateBoardDto) {

  await validation(CreateBoardDto, createBoardDto)

  if(!userId) {
    throw new BadRequestException('잘못된 요청입니다!')
  }

  let fileKey = '';
  // 상품 이미지 버킷에 업로드
  if (file) {
    fileKey = await this.s3FileService.uploadFile(file);
  }
  

  const {title, content} = createBoardDto
  const newBoard = this.boardsRepository.create({
    user_id: userId,
    title,
    content,
    profile: fileKey
  })

  await this.boardsRepository.save(newBoard)

    return newBoard
  }

  //어드민 전용 Role = admin Only / 서비스로 직접 접근하는 경우도 대비해야 하나?
  async findAll() {
    const board = await this.boardsRepository.find({
      relations: ['comments']
    }); 

    if(!board) {
      throw new BadRequestException('게시글이 존재하지 않습니다.')
    }

  return board
  }

  //어드민은 다른 유저 정보를 입력하면 볼 수 있게 할까?
  async findAllByUserId(userId: number) {

    if(!userId) {
      throw new BadRequestException('잘못된 요청입니다!')
    };
  
    const board = await this.boardsRepository.find({
      relations: ['comments'],
      where: {
        user_id: userId
      }})

      if(!board) {
        throw new BadRequestException('게시글이 존재하지 않습니다.')
      }

  return board;
  }

  //어드민은 다 찾을 수 있게 해주는 게 좋을려나
  
  async findOneByBoardId(userId: number, board_id: number) {

    if(!userId) {
      throw new BadRequestException('잘못된 요청입니다!')
    };

    if(!board_id) {
      throw new BadRequestException('게시글을 지정해 주세요.')
    };

    const board = await this.boardsRepository.findOne({
      relations: ['comments'],
      where: {
        id: board_id,
        user_id: userId,
      }
    });

    if(!board) {
      throw new BadRequestException('게시글이 존재하지 않습니다.')
    }

  return board;
  }

  
  async update(file: Express.Multer.File, userId: number, updateBoardDto: UpdateBoardDto) {

    if(!userId) {
      throw new BadRequestException('잘못된 요청입니다!')
    }

    await validation(UpdateBoardDto, updateBoardDto)

    let fileKey = '';
    // 상품 이미지 버킷에 업로드
    if (file) {
      fileKey = await this.s3FileService.uploadFile(file);
    }

    const {id, title, content} = updateBoardDto

    const board = await this.boardsRepository.findOneBy({id})
    
    if(!board) {
      throw new BadRequestException('존재하지 않는 게시글입니다.')
    }

    const update = this.boardsRepository.create({
      id,
      user_id: userId,
      title,
      content,
      profile: fileKey
    })

   await this.boardsRepository.save(update)
    return update 
  }
  
  async remove(userId: number, board_id: number) {
    
    if(!userId) {
      throw new BadRequestException('잘못된 요청입니다!')
    }

    if(!board_id) {
      throw new BadRequestException('게시글을 지정해 주세요.')
    };

    const board = await this.boardsRepository.findOne({
      where: {
        id:board_id,
        user_id: userId
      }
    })

    if(!board) {
      throw new BadRequestException('존재하지 않는 게시글입니다.')
    }

    await this.boardsRepository.delete(board)
    return {
      message: '게시글이 삭제되었습니다.',
      data: board
    }
  }
}

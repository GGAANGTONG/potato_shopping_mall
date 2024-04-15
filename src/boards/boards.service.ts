import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { Boards } from "./entities/boards.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { validation } from "../common/pipe/validationPipe";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { S3FileService } from "../common/utils/s3_fileupload";
import logger from '../common/log/logger'
import _ from "lodash";

export class BoardsService {
  constructor(@InjectRepository(Boards) private readonly boardsRepository: Repository<Boards>,
  private readonly s3FileService: S3FileService,
  ) {}

  async create(file: Express.Multer.File, userId: number, createBoardDto:CreateBoardDto) {

  await validation(CreateBoardDto, createBoardDto).catch(() => {
    const badRequestException = new BadRequestException('잘못된 요청입니다.')
    logger.errorLogger(badRequestException, `createBoardDto = ${JSON.stringify(createBoardDto)}`) 
    throw badRequestException
  })

  if(!userId || userId == 0) {

    const badRequestException = new BadRequestException('잘못된 요청입니다.')
    logger.errorLogger(badRequestException, `userId = ${userId}`) 
    throw badRequestException
  }

  let fileKey = '';
  // 상품 이미지 버킷에 업로드
  if (file) {
    fileKey = await this.s3FileService.uploadFile(file, 'boards');
  }
  

  const {title, content} = createBoardDto
  const newBoard = this.boardsRepository.create({
    user_id: userId,
    title,
    content,
    b_img: fileKey
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
      const badRequestException = new BadRequestException('게시글이 존재하지 않습니다.')
      logger.errorLogger(badRequestException, `board = ${board}`) 
      throw badRequestException
    }

  return board
  }

  //어드민은 다른 유저 정보를 입력하면 볼 수 있게 할까?
  async findAllByUserId(userId: number) {

    if(!userId || userId == 0) {
      const badRequestException = new BadRequestException('잘못된 요청입니다.')
      logger.errorLogger(badRequestException, `userId = ${userId}`) 
      throw badRequestException
    }
  
    const board = await this.boardsRepository.find({
      relations: ['comments'],
      where: {
        user_id: userId
      }})

      if(!board) {
        const badRequestException = new BadRequestException('게시글이 존재하지 않습니다.')
        logger.errorLogger(badRequestException, `board = ${board}`) 
        throw badRequestException
      }

  return board;
  }

  //어드민은 다 찾을 수 있게 해주는 게 좋을려나
  
  async findOneByBoardId(userId: number, board_id: number) {

    if(!userId || userId == 0) {
      const badRequestException = new BadRequestException('잘못된 요청입니다.')
      logger.errorLogger(badRequestException, `userId = ${userId}`) 
      throw badRequestException
    }

    if(!board_id || board_id == 0) {
      const badRequestException = new BadRequestException('게시글을 지정해 주세요.')
      logger.errorLogger(badRequestException, `board_id = ${board_id}`) 
      throw badRequestException
    };

    const board = await this.boardsRepository.findOne({
      relations: ['comments'],
      where: {
        id: board_id,
        user_id: userId,
      }
    });

    if(!board) {
      const badRequestException = new BadRequestException('게시글이 존재하지 않습니다.')
      logger.errorLogger(badRequestException, `board = ${board}`) 
      throw badRequestException
    }

  return board;
  }

  //이미 올린 이미지 처리 로직이 빠져있음(여기 트랜잭션 넣어야 하네)
  async update(file: Express.Multer.File, userId: number, updateBoardDto: UpdateBoardDto) {

    if(!userId || userId == 0) {
      const badRequestException = new BadRequestException('잘못된 요청입니다.')
      logger.errorLogger(badRequestException, `userId = ${userId}`) 
      throw badRequestException
    }

    await validation(UpdateBoardDto, updateBoardDto)

    const {id, title, content} = updateBoardDto

    const board = await this.boardsRepository.findOneBy({id})
    
    if(!board) {
      const badRequestException = new BadRequestException('게시글이 존재하지 않습니다.')
      logger.errorLogger(badRequestException, `board = ${board}`) 
      throw badRequestException
    }

    if (board.b_img) {
      try {
        await this.s3FileService.deleteFile(board.b_img);
      } catch (error) {
        const internalServerErrorException = new InternalServerErrorException(
          '파일 삭제 처리 중 알 수 없는 에러가 발생했습니다.',
        );
        logger.fatalLogger(internalServerErrorException, `board.b_img = ${board.b_img}`)

        throw internalServerErrorException;
      }
    }

    let fileKey = '';
    // 상품 이미지 버킷에 업로드
    if (file) {
      fileKey = await this.s3FileService.uploadFile(file,'boards');
    }

    const update = this.boardsRepository.create({
      id,
      user_id: userId,
      title,
      content,
      b_img: fileKey
    })

   await this.boardsRepository.save(update)
    return update 
  }
  
  //이미 올린 이미지 처리 로직이 빠져있음(여기 트랜잭션 넣어야 하네)
  async remove(userId: number, board_id: number) {
    console.log('국밥2', board_id)
    if(!userId || userId == 0) {
      const badRequestException = new BadRequestException('잘못된 요청입니다.')
      logger.errorLogger(badRequestException, `userId = ${userId}`) 
      throw badRequestException
    }
    console.log('국밥3', board_id)
    if(_.isNil(board_id) || board_id == 0) {
      const badRequestException = new BadRequestException('게시글을 지정해 주세요.')
      logger.errorLogger(badRequestException, `board_id = ${board_id}`) 
      throw badRequestException
    };
    console.log('국밥4', board_id)
    const board = await this.boardsRepository.findOne({
      where: {
        id:board_id,
        user_id: userId
      }
    })

    if(!board) {
      const badRequestException = new BadRequestException('게시글이 존재하지 않습니다.')
      logger.errorLogger(badRequestException, `board = ${board}`) 
      throw badRequestException
    }
    if (board.b_img) {
      try {
        await this.s3FileService.deleteFile(board.b_img);
      } catch (error) {
        const internalServerErrorException = new InternalServerErrorException(
          '파일 삭제 처리 중 알 수 없는 에러가 발생했습니다.',
        );
        logger.fatalLogger(internalServerErrorException, `board.b_img = ${board.b_img}`)

        throw internalServerErrorException;
      }
    }
    await this.boardsRepository.delete(board)
    return {
      message: '게시글이 삭제되었습니다.',
      data: board
    }
  }
}

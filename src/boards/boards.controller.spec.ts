import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { S3FileService } from '../common/utils/s3_fileupload';
import { CreateBoardDto } from './dto/create-board.dto';
import { validation } from '../configs/validationPipe';
import fs from 'fs'
import { UpdateBoardDto } from './dto/update-board.dto';

describe('BoardsController', () => {
  let controller: BoardsController;
  let boardsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByUserId: jest.fn(),
    findOneByBoardId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: 
      [
        {
          provide: BoardsService,
          useValue: boardsService
        },
        S3FileService
      ],
    }).compile();


    controller = module.get<BoardsController>(BoardsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('1-1. Boards - create, file & req & createBoardDto를 정상적으로 전달받아 게시글을 생성함', async () => {

    const file: Express.Multer.File = {
      fieldname: 'avatar',
      originalname: '195도짜리 국밥.jpg',
      encoding: 'utf-8',
      mimetype: 'image/jpeg',
      size: 1024, // 파일 크기를 바이트 단위로 가정
      destination: '/uploads/',
      filename: 'avatar-123.jpg',
      path: '/uploads/avatar-123.jpg',
      buffer: Buffer.from('This is a file buffer'),
      stream : fs.createReadStream('./s3_mocking_test')
  };
  const req = {
    user: {
      id: 1,
      role: 0
    }
  }

  const createBoardDto: CreateBoardDto = {
    title: '국밥이 차가워요',
    content: '국밥 온도가 220도보다 낮아요'
  }

  await validation(CreateBoardDto, createBoardDto)

  const returnValue = '차가운 국밥에 대한 클레임'

    boardsService.create.mockReturnValue(returnValue)

    return expect(controller.create(file, req, createBoardDto)).toBe(returnValue)
  })

  it('1-1. Boards - create, file == null || undefined & req & createBoardDto를 정상적으로 전달받아 게시글을 생성함', async () => {

    const file: Express.Multer.File = null || undefined
  const req = {
    user: {
      id: 1,
      role: 0
    }
  }

  const createBoardDto: CreateBoardDto = {
    title: '국밥이 차가워요',
    content: '국밥 온도가 220도보다 낮아요'
  }

  await validation(CreateBoardDto, createBoardDto)

  const returnValue = '차가운 국밥에 대한 클레임'

    boardsService.create.mockReturnValue(returnValue)

    return expect(controller.create(file, req, createBoardDto)).toBe(returnValue)
  })

  // it('1-#. Boards - create, file에 Express.Multer.File 형식이 아닌 다른 형식의 데이터를 전달받아 에러를 반환함', () => {})

  it('1-2. Boards - create, createBoardDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
  //   const file: Express.Multer.File = {
  //     fieldname: 'avatar',
  //     originalname: '195도짜리 국밥.jpg',
  //     encoding: 'utf-8',
  //     mimetype: 'image/jpeg',
  //     size: 1024, // 파일 크기를 바이트 단위로 가정
  //     destination: '/uploads/',
  //     filename: 'avatar-123.jpg',
  //     path: '/uploads/avatar-123.jpg',
  //     buffer: Buffer.from('This is a file buffer'),
  //     stream : fs.createReadStream('/path/to/file')
  // };
  // const req = {
  //   user: {
  //     id: 1,
  //     role: 0
  //   }
  // }

  const createBoardDto: CreateBoardDto = {
    title: '국밥이 차가워요',
    content: undefined || null
  }

  return await validation(CreateBoardDto, createBoardDto).then(() => {
    throw new Error('잘못된 테스트입니다.')
  }).catch((err) => expect(err))
  })

  it('2-1. Boards - findAll, 정상적으로 모든 게시글을 조회함', () => {
    const mockedReturn = '모든 게시글'
    boardsService.findAll.mockReturnValue(mockedReturn)

    return expect(controller.findAll()).toBe(mockedReturn)
  })

  it('3-1. Boards - findAllByUserId, 정상적으로 특정 유저의 모든 게시글을 조회함', () => {
    const req = {
      user: {
        id: 1
      }
    }
    const mockedReturn = `${req.user.id}번 유저의 모든 게시글`
    boardsService.findAllByUserId.mockReturnValue(mockedReturn)

    return expect(controller.findAllByUserId(req)).toBe(mockedReturn)
  })

  it('4-1. Boards - findOneByBoardId, 정상적으로 특정 게시글을 조회함', () => {
    const req = {
      user: {
        id: 1
      }
    }
    const board_id = 1
    const mockedReturn = `${req.user.id}번 유저의 ${board_id}번 게시글`
    boardsService.findOneByBoardId.mockReturnValue(mockedReturn)

    return expect(controller.findOneByBoardId(req, board_id)).toBe(mockedReturn)
  })

  it('5-1. Boards - update, file & req & updateBoardDto를 정상적으로 전달받아 게시글을 생성함', async () => {
    const file: Express.Multer.File = {
      fieldname: 'avatar',
      originalname: '195도짜리 국밥.jpg',
      encoding: 'utf-8',
      mimetype: 'image/jpeg',
      size: 1024, // 파일 크기를 바이트 단위로 가정
      destination: '/uploads/',
      filename: 'avatar-123.jpg',
      path: '/uploads/avatar-123.jpg',
      buffer: Buffer.from('This is a file buffer'),
      stream : fs.createReadStream('./s3_mocking_test')
  };
  const req = {
    user: {
      id: 1,
      role: 0
    }
  }

  const updateBoardDto: UpdateBoardDto = {
    id: 1,
    title: '국밥이 뜨거워요',
    content: '국밥 온도가 420도보다 높아요'
  }

  await validation(UpdateBoardDto, updateBoardDto)

  const returnValue = '너무 뜨거운 국밥에 대한 클레임'

    boardsService.update.mockReturnValue(returnValue)

    return expect(controller.update(file, req, updateBoardDto)).toBe(returnValue)
  })

  it('5-2. Boards - update, file == null || undefined & req & updateBoardDto를 정상적으로 전달받아 게시글을 생성함', async () => {
    const file: Express.Multer.File = undefined || null
  const req = {
    user: {
      id: 1,
      role: 0
    }
  }

  const updateBoardDto: UpdateBoardDto = {
    id: 1,
    title: '국밥이 뜨거워요',
    content: '국밥 온도가 420도보다 높아요'
  }

  await validation(UpdateBoardDto, updateBoardDto)

  const returnValue = '너무 뜨거운 국밥에 대한 클레임'

    boardsService.update.mockReturnValue(returnValue)

    return expect(controller.update(file, req, updateBoardDto)).toBe(returnValue)
  })

  // it('5-#. Boards - update, file에 Express.Multer.File 형식이 아닌 다른 형식의 데이터를 전달받아 에러를 반환함', () => {})

  it('5-2. Boards - update, updateBoardDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
    const file: Express.Multer.File = {
      fieldname: 'avatar',
      originalname: '195도짜리 국밥.jpg',
      encoding: 'utf-8',
      mimetype: 'image/jpeg',
      size: 1024, // 파일 크기를 바이트 단위로 가정
      destination: '/uploads/',
      filename: 'avatar-123.jpg',
      path: '/uploads/avatar-123.jpg',
      buffer: Buffer.from('This is a file buffer'),
      stream : fs.createReadStream('./s3_mocking_test')
  };
  const req = {
    user: {
      id: 1,
      role: 0
    }
  }

  const updateBoardDto: UpdateBoardDto = {
    id: 1,
    title: '국밥이 뜨거워요',
    content: '국밥 온도가 420도보다 높아요'
  }

  await validation(UpdateBoardDto, updateBoardDto).then(() => {
    throw new Error('잘못된 테스트입니다.')
  }).catch((err) => expect(err))

  })

  it('6-1. Boards - remove, req와 board_id를 전달받아 정상적으로 특정 유저의 특정 게시글을 삭제함', () => {
    const req = {
      user: {
        id: 1
      }
    }
    const board_id = 1
    const mockedReturn = `${req.user.id}번 유저의 ${board_id}번 게시글이 삭제됨`

    boardsService.remove.mockReturnValue(mockedReturn)

    return expect(controller.remove(req, board_id)).toBe(mockedReturn)
    
  })


});
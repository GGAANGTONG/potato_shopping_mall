import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Boards } from './entities/boards.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { S3FileService } from '../common/utils/s3_fileupload';
import fs from 'fs'
import { validation } from '../configs/validationPipe';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

describe('BoardsService', () => {
  let service: BoardsService;
  let boardsRepository: Partial<Record<keyof Repository<Boards>, jest.Mock>>;
  let s3FileService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn()
  };

  beforeEach(async () => {
    boardsRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      save: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: 
      [
        BoardsService,
        {
          provide: getRepositoryToken(Boards),
          useValue: boardsRepository
        },
        {
          provide: S3FileService,
          useValue: s3FileService
        }
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
  const userId = 1

  const createBoardDto: CreateBoardDto = {
    title: '국밥이 차가워요',
    content: '국밥 온도가 220도보다 낮아요'
  }

  await validation(CreateBoardDto, createBoardDto)

  const returnValue0 = '차가운 국밥 사진'

  s3FileService.uploadFile.mockResolvedValueOnce(returnValue0)

  const returnValue1 = '차가운 국밥에 대한 클레임'

  boardsRepository.create.mockReturnValueOnce(returnValue1)
  boardsRepository.save.mockReturnValueOnce(returnValue1)

  return await expect(service.create(file, userId, createBoardDto)).resolves.toBe(returnValue1)
  })

  it('1-2. Boards - create, file = null || undefined & req & createBoardDto를 정상적으로 전달받아 이미지파일 없이 게시글을 생성함', async () => {
    const file: Express.Multer.File = null || undefined
    const userId = 1

  const createBoardDto: CreateBoardDto = {
    title: '국밥이 차가워요',
    content: '국밥 온도가 220도보다 낮아요'
  }

  await validation(CreateBoardDto, createBoardDto)

  const returnValue1 = '차가운 국밥에 대한 클레임'

  boardsRepository.create.mockReturnValueOnce(returnValue1)
  boardsRepository.save.mockReturnValueOnce(returnValue1)

  return await expect(service.create(file, userId, createBoardDto)).resolves.toBe(returnValue1)
  })

  // it('1-#. Boards - create, file에 Express.Multer.File 형식이 아닌 다른 형식의 데이터를 전달받아 에러를 반환함', async () => {})

  it('1-3. Boards - create, createBoardDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
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

  // const userId = 1

  const createBoardDto: CreateBoardDto = {
    title: undefined,
    content: '국밥 온도가 220도보다 낮아요'
  }

  return await validation(CreateBoardDto, createBoardDto).then(() => {
    throw new Error('잘못된 테스트입니다.')
  }).catch((err) => expect(err))

  })

  it('1-4. Boards - create, userId에 0 || null || undefined가 할당된채로 전달받아 에러를 반환함 ', async () => {
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
  const userId = 0

  const createBoardDto: CreateBoardDto = {
    title: '국밥이 차가워요',
    content: '국밥 온도가 220도보다 낮아요'
  }

  await validation(CreateBoardDto, createBoardDto)

  const returnValue0 = '차가운 국밥 사진'

  s3FileService.uploadFile.mockResolvedValueOnce(returnValue0)

  const returnValue1 = '차가운 국밥에 대한 클레임'

  boardsRepository.create.mockReturnValueOnce(returnValue1)
  boardsRepository.save.mockReturnValueOnce(returnValue1)

  return await expect(service.create(file, userId, createBoardDto)).rejects.toThrow(BadRequestException)
  })

  it('2-1. Boards - findAll, 정상적으로 모든 게시글을 조회함', async () => {
    const mockedReturn = '모든 게시글'
    boardsRepository.find.mockReturnValueOnce(mockedReturn)

    return await expect(service.findAll()).resolves.toBe(mockedReturn)
  })

  it('2-2. Boards - findAll, 게시글이 조회되지 않아 에러를 반환함', async () => {
    const mockedReturn = undefined || null
    boardsRepository.find.mockReturnValueOnce(mockedReturn)

    return expect(service.findAll()).rejects.toThrow(BadRequestException)
  })

  it('3-1. Boards - findAllByUserId, 정상적으로 특정 유저의 모든 게시글을 조회함', async () => {
    const userId = 1
    const mockedReturn = `${userId}번 유저의 모든 게시글`
    boardsRepository.find.mockReturnValueOnce(mockedReturn)

    return expect(service.findAllByUserId(userId)).resolves.toBe(mockedReturn)
  })

  it('3-2. Boards - findAllByUserId, userId에 0 || null || undefined가 할당된채로 전달되어 에러를 반환함', async () => {
    const userId = 0

    return await expect(service.findAllByUserId(userId)).rejects.toThrow(BadRequestException)
  })

  it('3-3. Boards - findAllByUserId, user id에 해당하는 유저가 작성한 게시글이 없어 조회되지 않아 에러를 반환함', async () => {
    const userId = 1
    const mockedReturn = null || undefined
    boardsRepository.find.mockReturnValueOnce(mockedReturn)

    return await expect(service.findAllByUserId(userId)).rejects.toThrow(BadRequestException)
  })

  it('4-1. Boards - findOneByBoardId, 정상적으로 특정 게시글을 조회함', async () => {
    const userId = 1
    const board_id = 1
    const mockedReturn = `${userId}번 유저의 ${board_id}번 게시글`
    boardsRepository.findOne.mockReturnValueOnce(mockedReturn)

    return await expect(service.findOneByBoardId(userId, board_id)).resolves.toBe(mockedReturn)
  })

  it('4-2. Boards - findOneByBoardId,userId에 0 || null || undefined가 할당된채로 전달되어 에러를 반환함', async () => {
    const userId = 0
    const board_id = 1

    return await expect(service.findOneByBoardId(userId, board_id)).rejects.toThrow(BadRequestException)
  })

  it('4-3. Boards - findOneByBoardId, boards_id에 0 || null || undefined가 할당된채로 전달되어 에러를 반환함', async () => {
    const userId = 1
    const board_id = 0


    return await expect(service.findOneByBoardId(userId, board_id)).rejects.toThrow(BadRequestException)
  })

  it('4-4. Boards - findOneByBoardId, board 정보가 조회되지 않아 에러를 반환함', async () => {
    const userId = 1
    const board_id = 1
    const mockedReturn = null || undefined
    boardsRepository.findOne.mockReturnValueOnce(mockedReturn)

    return await expect(service.findOneByBoardId(userId, board_id)).rejects.toThrow(BadRequestException)
  })

  it('5-1. Boards - update, file & req & updateBoardDto를 정상적으로 전달받아 게시글을 수정함', async () => {
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
  const userId = 1

  const updateBoardDto: UpdateBoardDto = {
    id: 1,
    title: '국밥이 뜨거워요',
    content: '국밥 온도가 420도보다 높아요'
  }

  await validation(UpdateBoardDto, updateBoardDto)

  const returnOriginalValue = '너무 차가운 국밥에 대한 클레임'

  boardsRepository.findOneBy.mockResolvedValueOnce(returnOriginalValue)

  const returnDeletingValue = `사진이 삭제되었습니다.`

  s3FileService.deleteFile.mockResolvedValueOnce(returnDeletingValue)

  const returnValue0 = '너무 뜨거운 국밥 사진'

  s3FileService.uploadFile.mockResolvedValueOnce(returnValue0)


  const returnValue1 = '너무 뜨거운 국밥에 대한 클레임'

  boardsRepository.create.mockReturnValueOnce(returnValue1)
  boardsRepository.save.mockReturnValueOnce(returnValue1)

  return await expect(service.update(file, userId, updateBoardDto)).resolves.toBe(returnValue1)
  })

  it('5-2. Boards - update, file === null || undefined & req & updateBoardDto를 정상적으로 전달받아 이미지 수정 없이 게시글을 수정함', async () => {
  const file: Express.Multer.File = null || undefined
  const userId = 1

  const updateBoardDto: UpdateBoardDto = {
    id: 1,
    title: '국밥이 뜨거워요',
    content: '국밥 온도가 420도보다 높아요'
  }

  await validation(UpdateBoardDto, updateBoardDto)

  const returnOriginalValue = '너무 차가운 국밥에 대한 클레임'

  boardsRepository.findOneBy.mockResolvedValueOnce(returnOriginalValue)

  const returnValue1 = '너무 뜨거운 국밥에 대한 클레임'

  boardsRepository.create.mockReturnValueOnce(returnValue1)
  boardsRepository.save.mockReturnValueOnce(returnValue1)

  return await expect(service.update(file, userId, updateBoardDto)).resolves.toBe(returnValue1)
  })

  // it('5-#. Boards - update, file에 Express.Multer.File 형식이 아닌 다른 형식의 데이터를 전달받아 에러를 반환함', async () => {})

  it('5-3. Boards - update, updateBoardDto가 불완전한 상태로 전달받아 에러를 반환함(board_id == 0 인 케이스도 여기서 걸러짐)', async () => {

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
  //     stream : fs.createReadStream('./s3_mocking_test')
  // };
  // const userId = 1
    
    const updateBoardDto: UpdateBoardDto = {
      id: 0,
      title: '국밥이 뜨거워요',
      content: '국밥 온도가 420도보다 높아요'
    }

    return  await validation(UpdateBoardDto, updateBoardDto).then(() => {
      throw new Error('잘못된 테스트입니다.')
    }).catch((err) => expect(err))

  })

  it('5-4. Boards - userId에 0 || undefined || null이 할당된채 전달받아 에러를 반환함', async () => {
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
  const userId = 0

  const updateBoardDto: UpdateBoardDto = {
    id: 1,
    title: '국밥이 뜨거워요',
    content: '국밥 온도가 420도보다 높아요'
  }

  await validation(UpdateBoardDto, updateBoardDto)

  const returnValue0 = '너무 뜨거운 국밥 사진'

  s3FileService.uploadFile.mockResolvedValueOnce(returnValue0)

  const returnValue1 = '너무 뜨거운 국밥에 대한 클레임'

  boardsRepository.create.mockReturnValueOnce(returnValue1)
  boardsRepository.save.mockReturnValueOnce(returnValue1)

  return await expect(service.update(file, userId, updateBoardDto)).rejects.toThrow(BadRequestException)
  })

  it('5-5. Boards - update, file & req & updateBoardDto를 정상적으로 전달받았지만, updateBoardDto에 할당된 board_id에 해당하는 게시글을 조회하지 못해 에러를 반환함', async () => {
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
  const userId = 1

  const updateBoardDto: UpdateBoardDto = {
    id: 1,
    title: '국밥이 뜨거워요',
    content: '국밥 온도가 420도보다 높아요'
  }

  await validation(UpdateBoardDto, updateBoardDto)

  const returnValue0 = '너무 뜨거운 국밥 사진'

  s3FileService.uploadFile.mockResolvedValueOnce(returnValue0)

  const returnOriginalValue = null || undefined

  boardsRepository.findOneBy.mockResolvedValueOnce(returnOriginalValue)

  return await expect(service.update(file, userId, updateBoardDto)).rejects.toThrow(BadRequestException)
  })


  

  it('6-1. Boards - remove, userId와 board_id를 전달받아 정상적으로 특정 유저의 특정 게시글을 삭제함', async () => {
    const userId = 1
    const board_id = 1


    const returnValue = '너무 차가운 국밥에 대한 클레임'

    boardsRepository.findOne.mockResolvedValueOnce(returnValue)

    const returnDeletingValue = `사진이 삭제되었습니다.`

    s3FileService.deleteFile.mockResolvedValueOnce(returnDeletingValue)

    const mockedReturn = {
      message: '게시글이 삭제되었습니다.',
      data: returnValue
    }

    boardsRepository.delete.mockReturnValueOnce(mockedReturn)

    return await expect(service.remove(userId, board_id)).resolves.toEqual(mockedReturn)
    
  })

  it('6-2. Boards - remove, userId에 0 || null || undefined가 할당된 채 전달받아 에러를 반환함', async () => {
    const userId = 0
    const board_id = 1


    return await expect(service.remove(userId, board_id)).rejects.toThrow(BadRequestException)
    
  })

  it('6-3. Boards - remove, board_id에 0 || null || undefined가 할당된 채 전달받아 에러를 반환함', async () => {
    const userId = 1
    const board_id = 0

    return await expect(service.remove(userId, board_id)).rejects.toThrow(BadRequestException)
    
  })

  it('6-4. Boards - 게시글이 조회되지 않아 에러를 반환함', async () => {
    const userId = 1
    const board_id = 1
    const mockedReturn = null || undefined

    const returnOriginalValue = null || undefined

    boardsRepository.findOneBy.mockResolvedValueOnce(returnOriginalValue)

    boardsRepository.delete.mockReturnValueOnce(mockedReturn)

    return await expect(service.remove(userId, board_id)).rejects.toThrow(BadRequestException)
    
  })
});

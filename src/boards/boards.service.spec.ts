import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Boards } from './entities/boards.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('BoardsService', () => {
  let service: BoardsService;
  let boardsRepository: Partial<Record<keyof Repository<Boards>, jest.Mock>>;

  beforeEach(async () => {
    boardsRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: 
      [
        BoardsService,
        {
          provide: getRepositoryToken(Boards),
          useValue: boardsRepository
        }
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('1-1. Boards - create, file & req & createBoardDto를 정상적으로 전달받아 게시글을 생성함', async () => {

  })

  it('1-2. Boards - create, file에 Express.Multer.File 형식이 아닌 다른 형식의 데이터를 전달받아 에러를 반환함', async () => {
    
  })

  it('1-3. Boards - create, createBoardDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
    
  })

  it('2-1. Boards - findAll, 정상적으로 모든 게시글을 조회함', async () => {
    const mockedReturn = '모든 게시글'
    boardsRepository.find.mockReturnValue(mockedReturn)

    return await expect(service.findAll()).resolves.toBe(mockedReturn)
  })

  it('2-2. Boards - findAll, 게시글이 조회되지 않아 에러를 반환함', async () => {
    const mockedReturn = undefined || null
    boardsRepository.find.mockReturnValue(mockedReturn)

    return expect(service.findAll()).rejects.toThrow(BadRequestException)
  })

  it('3-1. Boards - findAllByUserId, 정상적으로 특정 유저의 모든 게시글을 조회함', async () => {
    const userId = 1
    const mockedReturn = `${userId}번 유저의 모든 게시글`
    boardsRepository.find.mockReturnValue(mockedReturn)

    return expect(service.findAllByUserId(userId)).resolves.toBe(mockedReturn)
  })

  it('3-2. Boards - findAllByUserId, userId에 null/undefined가 할당된채 전달되어 에러를 반환함', async () => {
    const userId = null || undefined

    return expect(service.findAllByUserId(userId)).rejects.toThrow(BadRequestException)
  })

  it('3-3. Boards - findAllByUserId, user id에 해당하는 유저가 작성한 게시글이 없어 조회되지 않아 에러를 반환함', async () => {
    const userId = 1
    const mockedReturn = null || undefined
    boardsRepository.find.mockReturnValue(mockedReturn)

    return expect(service.findAllByUserId(userId)).rejects.toThrow(BadRequestException)
  })

  it('4-1. Boards - findOneByBoardId, 정상적으로 특정 게시글을 조회함', async () => {
    const userId = 1
    const board_id = 1
    const mockedReturn = `${userId}번 유저의 ${board_id}번 게시글`
    boardsRepository.findOne.mockReturnValue(mockedReturn)

    return expect(service.findOneByBoardId(userId, board_id)).toBe(mockedReturn)
  })

  it('4-2. Boards - findOneByBoardId, userId에 null/undefined가 할당된 채 전달되어 에러를 반환함', async () => {
    const userId = null || undefined
    const board_id = 1

    return expect(service.findOneByBoardId(userId, board_id)).rejects.toThrow(BadRequestException)
  })

  it('4-3. Boards - findOneByBoardId, boards_id에 null/undefined가 할당된 채 전달되어 에러를 반환함', async () => {
    const userId = 1
    const board_id = null || undefined


    return expect(service.findOneByBoardId(userId, board_id)).rejects.toThrow(BadRequestException)
  })

  it('4-4. Boards - findOneByBoardId, board 정보가 조회되지 않아 에러를 반환함', async () => {
    const userId = 1
    const board_id = 1
    const mockedReturn = null || undefined
    boardsRepository.findOne.mockReturnValue(mockedReturn)

    return expect(service.findOneByBoardId(userId, board_id)).rejects.toThrow(BadRequestException)
  })

  it('5-1. Boards - update, file & req & updateBoardDto를 정상적으로 전달받아 게시글을 생성함', async () => {

  })

  it('5-2. Boards - update, file에 Express.Multer.File 형식이 아닌 다른 형식의 데이터를 전달받아 에러를 반환함', async () => {
    
  })

  it('5-3. Boards - update, updateBoardDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
    
  })

  it('6-1. Boards - remove, userId와 board_id를 전달받아 정상적으로 특정 유저의 특정 게시글을 삭제함', async () => {
    const userId = 1
    const board_id = 1
    const mockedReturn = `${userId}번 유저의 ${board_id}번 게시글이 삭제됨`

    boardsRepository.delete.mockReturnValue(mockedReturn)

    return expect(service.remove(userId, board_id)).toBe(mockedReturn)
    
  })

  it('6-2. Boards - remove, userId에 null/undefined가 할당된 채 전달받아 에러를 반환함', async () => {
    const userId = null || undefined
    const board_id = 1


    return expect(service.remove(userId, board_id)).rejects.toThrow(BadRequestException)
    
  })

  it('6-3. Boards - remove, board_id에 null/undefined가 할당된 채 전달받아 에러를 반환함', async () => {
    const userId = 1
    const board_id = undefined || null

    return expect(service.remove(userId, board_id)).rejects.toThrow(BadRequestException)
    
  })

  it('6-4. Boards - 게시글이 조회되지 않아 에러를 반환함', async () => {
    const userId = 1
    const board_id = 1
    const mockedReturn = null || undefined

    boardsRepository.delete.mockReturnValue(mockedReturn)

    return expect(service.remove(userId, board_id)).rejects.toThrow(BadRequestException)
    
  })
});

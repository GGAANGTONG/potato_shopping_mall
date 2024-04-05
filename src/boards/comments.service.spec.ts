import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { Comments } from './entities/comments.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { validation } from '../configs/validationPipe';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { S3FileService } from '../common/utils/s3_fileupload';

describe('CommentsService', ()=> {
  let service: CommentsService;
  let commentsRepository: Partial<Record<keyof Repository<Comments>, jest.Mock>>;

  beforeEach(async ()=> {
    commentsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        S3FileService,
        {
          provide: getRepositoryToken(Comments),
          useValue: commentsRepository
        }
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined',async ()=> {
    expect(service).toBeDefined();
  });

  it('1-1. Comments - create, userId & createCommentDto를 정상적으로 전달받아 댓글을 생성함', async ()=> {
    const userId = 1
    const createCommentDto:CreateCommentDto = {
      board_id: 1,
      content: '위대한 국밥이군요'
    }

    await validation(CreateCommentDto, createCommentDto)

    const mockReturn = '생성된 댓글'
    commentsRepository.create.mockReturnValue(mockReturn)
    commentsRepository.save.mockReturnValue(mockReturn)

    return await expect(service.create(userId, createCommentDto)).resolves.toBe(mockReturn)
  })

  it('1-2. Comments - create, userId에 null || undefined가 할당된채로 전달받아 에러를 반환함', async ()=> {
    const userId = null || undefined
    const createCommentDto:CreateCommentDto = {
      board_id: 1,
      content: '위대한 국밥이군요'
    }

    return await expect(service.create(userId, createCommentDto)).rejects.toThrow(BadRequestException)
  })


  it('1-3. Comments - create, createCommentDto가 불완전한 상태로 전달받아 에러를 반환함', async ()=> {
    const userId = 1
    const createCommentDto:CreateCommentDto = {
      board_id: 1,
      content: undefined || null
    }

  return await validation(CreateCommentDto, createCommentDto).then(() => {return new BadRequestException('테스트가 잘못되었습니다.')}).catch(err => expect(err))

  })

  it('2-1. Comments - findAllByUserId, 정상적으로 특정 유저의 모든 댓글을 조회함',async ()=> {
    const userId = 1
    const board_id = null || undefined
    const mockedReturn = `${userId}번 유저의 모든 댓글`
    commentsRepository.find.mockReturnValue(mockedReturn)

    return await expect(service.findAllByUserId(userId, board_id)).resolves.toBe(mockedReturn)
  })

  it('2-2. Comments - findAllByUserId, 정상적으로 특정 유저의 특정 게시글의 모든 댓글을 조회함',async ()=> {
    const userId = 1
    const board_id = 1
    const mockedReturn = `${userId}번 유저의 ${board_id}번 게시글의 모든 댓글`
    commentsRepository.find.mockReturnValue(mockedReturn)

    return await expect(service.findAllByUserId(userId, board_id)).resolves.toBe(mockedReturn)
  })

  it('2-3. Comments - findAllByUserId, userId에 null || undefined가 할당된 채로 전달받아 에러를 반환함', async ()=> {
    const userId = null || undefined
    const board_id = 1

    return await expect(service.findAllByUserId(userId, board_id)).rejects.toThrow(BadRequestException)
  })

  it('2-4. Comments - findAllByUserId, userId에 해당하는 유저가 남긴 게시글이 조회되지 않아 에러를 반환함',async ()=> {
    const userId = 1
    const mockedReturn = null || undefined
    commentsRepository.find.mockReturnValue(mockedReturn)

    return await expect(service.findAllByUserId(userId)).rejects.toThrow(BadRequestException)
  })


  it('3-1. Comments - findAll, 정상적으로 모든 댓글을 조회함',async ()=> {
    const mockedReturn = '모든 댓글'
    commentsRepository.find.mockReturnValue(mockedReturn)

    return await expect(service.findAll()).resolves.toBe(mockedReturn)
  })

  it('3-2. Comments - findAll, 댓글이 조회되지 않아 에러를 반환함',async ()=> {
    const mockedReturn = null || undefined
    commentsRepository.find.mockReturnValue(mockedReturn)

    return await expect(service.findAll()).rejects.toThrow(BadRequestException)
  })


  it('4-1. Comments - update, userId & updateBoardDto를 정상적으로 전달받아 댓글을 생성함', async ()=> {

    const userId = 1
    const updateCommentDto:UpdateCommentDto = {
      board_id: 1,
      content: '죽음의 국밥이군요'
    }

    await validation(UpdateCommentDto, updateCommentDto)

    const mockReturn = '갱신된 댓글'
    commentsRepository.create.mockReturnValue(mockReturn)

    return await expect(service.create(userId, updateCommentDto)).resolves.toBe(mockReturn)

  })

  it('4-2. Comments - update, userId에 null || undefined가 할당된 채로 전달받아 에러를 반환함', async ()=> {
    const userId = null || undefined
    const updateCommentDto:UpdateCommentDto = {
      board_id: 1,
      content: '죽음의 국밥이군요'
    }

    return await expect(service.findAll()).rejects.toThrow(BadRequestException)
  })


  it('4-3. Comments - update, updateCommentDto가 불완전한 상태로 전달받아 에러를 반환함', async ()=> {
    
    const userId = 1
    const updateCommentDto:UpdateCommentDto = {
      board_id: 1,
      content: undefined || null
    }

  return await validation(UpdateCommentDto, updateCommentDto).then(() => {return new BadRequestException('테스트가 잘못되었습니다.')}).catch(err => expect(err))

  })

  it('4-4. Comments - update, 전달받은 userId와 updateCommentDto에 해당하는 댓글을 조회할 수 없어서 에러를 반환함', async ()=> {
    
    const userId = 1
    const updateCommentDto:UpdateCommentDto = {
      board_id: 1,
      content: null || undefined
    }

  await validation(UpdateCommentDto, updateCommentDto)

  const mockReturn = null || undefined
  commentsRepository.update.mockReturnValue(mockReturn)

  return await expect(service.update(userId, updateCommentDto)).rejects.toThrow(BadRequestException)
  })

  it('5-1. Comments - remove, req와 board_id를 전달받아 정상적으로 특정 유저의 특정 댓글을 삭제함',async ()=> {
    const userId = 1
    const commentId = 1
    const mockedReturn0 = `${userId}번 유저의 ${commentId}번 게시글`
    const mockedReturn1 = `${userId}번 유저의 ${commentId}번 게시글이 삭제됨`

    commentsRepository.findOne.mockReturnValue(mockedReturn0)
    commentsRepository.remove.mockReturnValue(mockedReturn1)

    const mockedResult = {
      message: '댓글이 삭제되었습니다.',
      data: mockedReturn0
    }

    return await expect(service.remove(userId, commentId)).resolves.toBe(mockedResult)
    
  })

  it('5-2. Comments - remove, userId, commentId 중 하나 이상에 undefined || null이 할당된 채로 전달받아 에러를 반환함',async ()=> {
    const userId = null || undefined
    const commentId = 1

    return await expect(service.remove(userId, commentId)).rejects.toThrow(BadRequestException)
    
  })

  it('5-3. Comments - remove, userId와 commentId에 해당하는 댓글이 없어 에러를 반환함',async ()=> {
    const userId = 1 
    const commentId = 1
    const mockedReturn0 = null || undefined 

    commentsRepository.findOne.mockReturnValue(mockedReturn0)

    return await expect(service.remove(userId, commentId)).rejects.toThrow(mockedReturn0)
    
  })
});



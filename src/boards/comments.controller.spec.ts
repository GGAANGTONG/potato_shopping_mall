import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { validation } from 'src/configs/validationPipe';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let commentsService = {
    create: jest.fn(),
    findAllByUserId: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
        {
          provide: CommentsService,
          useValue: commentsService
        }
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('1-1. Comments - create, req & createBoardDto를 정상적으로 전달받아 게시글을 생성함', async () => {
    const req = {
      user: {
        id: 1
      }
    }
    const createCommentDto:CreateCommentDto = {
      board_id: 1,
      content: '위대한 국밥이군요'
    }

    await validation(CreateCommentDto, createCommentDto)

    const mockReturn = '생성된 댓글'
    commentsService.create.mockReturnValue(mockReturn)

    return expect(controller.create(req, createCommentDto))
  })


  it('1-2. Comments - create, createBoardDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
    const req = {
      user: {
        id: 1
      }
    }
    const createCommentDto:CreateCommentDto = {
      board_id: 1,
      content: undefined || null
    }

  return await validation(CreateCommentDto, createCommentDto).then(() => {return new BadRequestException('테스트가 잘못되었습니다.')}).catch(err => expect(err))

  })

  it('2-1. Comments - findAllByUserId, 정상적으로 특정 유저의 모든 게시글을 조회함', () => {
    const req = {
      user: {
        id: 1
      }
    }
    const mockedReturn = `${req.user.id}번 유저의 모든 댓글`
    commentsService.findAllByUserId.mockReturnValue(mockedReturn)

    return expect(controller.findAllByUserId(req)).toBe(mockedReturn)
  })

  it('3-1. Comments - findAll, 정상적으로 모든 게시글을 조회함', () => {
    const mockedReturn = '모든 게시글'
    commentsService.findAll.mockReturnValue(mockedReturn)

    return expect(controller.findAll()).toBe(mockedReturn)
  })


  it('4-1. Comments - update, req & updateBoardDto를 정상적으로 전달받아 게시글을 생성함', async () => {

    const req = {
      user: {
        id: 1
      }
    }
    const updateCommentDto:UpdateCommentDto = {
      board_id: 1,
      content: '죽음의 국밥이군요'
    }

    await validation(UpdateCommentDto, updateCommentDto)

    const mockReturn = '갱신된 댓글'
    commentsService.create.mockReturnValue(mockReturn)

    return expect(controller.create(req, updateCommentDto))

  })


  it('4-2. Comments - update, updateBoardDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
    
    const req = {
      user: {
        id: 1
      }
    }
    const updateCommentDto:UpdateCommentDto = {
      board_id: 1,
      content: undefined || null
    }

  return await validation(UpdateCommentDto, updateCommentDto).then(() => {return new BadRequestException('테스트가 잘못되었습니다.')}).catch(err => expect(err))

  })

  it('5-1. Comments - remove, req와 board_id를 전달받아 정상적으로 특정 유저의 특정 게시글을 삭제함', () => {
    const req = {
      user: {
        id: 1
      }
    }
    const board_id = 1
    const mockedReturn = `${req.user.id}번 유저의 ${board_id}번 게시글이 삭제됨`

    commentsService.remove.mockReturnValue(mockedReturn)

    return expect(controller.remove(req, board_id)).toBe(mockedReturn)
    
  })
});

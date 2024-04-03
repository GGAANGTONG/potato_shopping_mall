import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

describe('ReviewsController', () => {
  let controller: ReviewController;
  const reviewService = {
    createReview: jest.fn(),
    getReviewByOrderId: jest.fn(),
    updateReviewByOrderId: jest.fn(),
    deleteReviewByOrderId: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
      {
        provide: ReviewService,
        useValue: reviewService
      }
      ]
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('ReviewsController', () => {
    return expect(controller).toBeDefined();
  });

  it('1-1. Review - createReview, ordersId, stars, review를 전달받아 리뷰 생성에 성공함', async () => {
    const ordersId = 1
    const body = {
      stars: '5',
      review: '역시 국밥입니다!'
    }

    const returnValue = '리뷰가 생성됐습니다.'
    reviewService.createReview.mockResolvedValue(returnValue)

    return await expect(controller.createReview(ordersId, body)).resolves.toBe(returnValue)

  }) 

  it('1-2. Review - createReview, ordersId에 null/undefined가 할당된 채 전달받아 에러를 반환함', async () => {
    const ordersId = null || undefined
    const body = {
      stars: '5',
      review: '역시 국밥입니다!'
    }

    const returnValue = '리뷰가 생성됐습니다.'
    reviewService.createReview.mockResolvedValue(returnValue)

    return await expect(controller.createReview(ordersId, body)).rejects.toThrow()
  }) 

  it('1-3. Review - createReview, body의 프로퍼티 중 일부에 null/undefined가 할당된 채 전달받아 에러를 반환함', async () => {
    const ordersId = 1
    const body = {
      stars: '',
      review: '역시 국밥입니다!'
    }

    const returnValue = '리뷰가 생성됐습니다.'
    reviewService.createReview.mockResolvedValue(returnValue)

    return await expect(controller.createReview(ordersId, body)).rejects.toThrow()
  }) 

  it('2-1. Review - getReviewByOrderId, ordersId를 전달받아 해당 ordersId에 해당하는 리뷰를 반환함', async () => {
    const ordersId = 1

    const returnValue = {
      stars: '5',
      review: '국밥이 최곱니다!'
    }
    reviewService.getReviewByOrderId.mockResolvedValue(returnValue)

    return await expect(controller.getReviewByOrderId(ordersId)).resolves.toBe(returnValue)

  }) 

  it('2-2. Review - getReviewByOrderId, ordersId에 null/undefined가 할당된 채 전달받아 에러를 반환함', async () => {
    const ordersId = 1

    const returnValue = {
      stars: '5',
      review: '국밥이 최곱니다!'
    }
    reviewService.getReviewByOrderId.mockResolvedValue(returnValue)

    return await expect(controller.getReviewByOrderId(ordersId)).rejects.toThrow()

  }) 

  it('3-1. Review - updateReviewByOrderId, ordersId, stars, review를 전달받아 리뷰 수정에 성공함', async () => {
    const ordersId = 1
    const body = {
      stars: '3',
      review: '역시 국밥이 아닙니다!'
    }

    const returnValue = '리뷰가 수정됐습니다.'
    reviewService.updateReviewByOrderId.mockResolvedValue(returnValue)

    return await expect(controller.updateReviewByOrderId(ordersId, body)).resolves.toBe(returnValue)

  }) 

  it('3-2. Review - updateReviewByOrderId, ordersId에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    const ordersId = undefined || null
    const body = {
      stars: '3',
      review: '역시 국밥이 아닙니다!'
    }

    const returnValue = '리뷰가 수정됐습니다.'
    reviewService.updateReviewByOrderId.mockResolvedValue(returnValue)

    return await expect(controller.updateReviewByOrderId(ordersId, body)).rejects.toThrow()

  }) 

  it('3-3. Review - updateReviewByOrderId, body에 데이터가 할당되지 않은 상태로 전달받아 에러를 반환함', async () => {
    const ordersId = 1
    const body = {
      stars: '',
      review: ''
    }

    const returnValue = '리뷰가 수정됐습니다.'
    reviewService.updateReviewByOrderId.mockResolvedValue(returnValue)

    return await expect(controller.updateReviewByOrderId(ordersId, body)).rejects.toThrow()

  }) 

  it('4-1. Review - deleteReviewByOrderId, ordersId를 전달받아 해당 리뷰의 삭제가 완료됨', async () => {
    const ordersId = 1

    const returnValue = '리뷰가 삭제됐습니다.'
    reviewService.deleteReviewByOrderId.mockResolvedValue(returnValue)

    return await expect(controller.deleteReviewByOrderId(ordersId)).resolves.toBe(returnValue)

  }) 

  it('4-2. Review - deleteReviewByOrderId, ordersId에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    const ordersId = null || undefined

    const returnValue = '리뷰가 삭제됐습니다.'
    reviewService.deleteReviewByOrderId.mockResolvedValue(returnValue)

    return await expect(controller.deleteReviewByOrderId(ordersId)).rejects.toThrow()
    
  }) 

});

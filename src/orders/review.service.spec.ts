import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Reviews } from './entities/review.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReviewsService', () => {
  let service: ReviewService;
  let reviewsRepository: Partial<Record<keyof Repository<Reviews>, jest.Mock>>;

  beforeEach(async () => {
    reviewsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Reviews),
          useValue: reviewsRepository
        }
      
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('1-1. Reviews - createReview, ordersId, stars, review 데이터를 createReviewDto를 통해 전달받아 성공적으로 ordersId에 해당하는 리뷰를 생성함', async () => {
    const ordersId = 1
    const stars = '5'
    const review = '국밥은 국밥입니다!'
    // const createReviewDto:CreateReviewDto = {
    //   starts: '5',
    //   review: '국밥은 국밥입니다!'
    // }
    const returnedValue = {
      ordersId: 1,
      stars: '5',
      review: '국밥은 국밥입니다!'
    }
    reviewsRepository.create.mockResolvedValue(returnedValue)
    reviewsRepository.save.mockResolvedValue(returnedValue)

    return await expect(service.createReview(ordersId, stars, review)).resolves.toBe(returnedValue)
  })

  it('1-2. Reviews - createReview, ordersId에 null/undefined가 할당된채 전달받아, 에러를 반환함', async () => {
    const ordersId = null || undefined
    const stars = '5'
    const review = '국밥은 국밥입니다!'
        // const createReviewDto:CreateReviewDto = {
    //   starts: '5',
    //   review: '국밥은 국밥입니다!'
    // }

    return await expect(service.createReview(ordersId, stars, review)).rejects.toThrow()
  })

  it('1-3. Reviews - createReview, createReviewDto에 null/undefined값이 할당된채 전달받아, 에러를 반환함', async () => {
    const ordersId = 1
    const stars = '';
    const review = '국밥은 국밥입니다!'
        // const createReviewDto:CreateReviewDto = {
    //   starts: '',
    //   review: '국밥은 국밥입니다!'
    // }

    return await expect(service.createReview(ordersId, stars, review)).rejects.toThrow()
  })

  it('2-1. Reviews - getReviewByOrderId, ordersId를 전달받아 성공적으로 ordersId에 해당하는 리뷰를 조회함', async () => {
    const ordersId = 1

    const returnedValue = {
      ordersId: 1,
      stars: '5',
      review: '국밥은 국밥입니다!'
    }
    reviewsRepository.findOne.mockResolvedValue(returnedValue)

    return await expect(service.getReviewByOrderId(ordersId)).resolves.toBe(returnedValue)
  }) 

  it('2-2. Reviews - getReviewByOrderId, ordersId에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    const ordersId = null || undefined

    const returnedValue = {
      ordersId: 1,
      stars: '5',
      review: '국밥은 국밥입니다!'
    }
    reviewsRepository.findOne.mockResolvedValue(returnedValue)

    return await expect(service.getReviewByOrderId(ordersId)).rejects.toThrow()
  }) 

  it('3-1. Reviews - updateReviewByOrderId, ordersId, stars, review 데이터를 updateReviewDto를 통해 전달받아 성공적으로 ordersId에 해당하는 리뷰를 업데이트함', async () => {
    const ordersId = 1
    const stars = '3'
    const review = '국밥은 국밥이 아닙니다!'
    // const updateReviewDto:UpdateReviewDto = {
    //   stars: '3',
    //   review: '국밥은 국밥이 아닙니다!'
    // }
    const returnedOriginalValue = {
      ordersId: 1,
      stars: '5',
      review: '국밥은 국밥입니다!'
    }
    // const returnedUpdatedValue = {
    //   ordersId: 1,
    //   stars: updateReviewDto.stars,
    //   review: updateReviewDto.review
    // }

      const returnedUpdatedValue = {
      ordersId: 1,
      stars: '3',
      review: '국밥은 국밥이 아닙니다!'
    }
    reviewsRepository.findOne.mockResolvedValue(returnedOriginalValue)
    reviewsRepository.save.mockResolvedValue(returnedUpdatedValue)

    return await expect(service.updateReviewByOrderId(ordersId, stars, review)).resolves.toBe(returnedUpdatedValue)
  })

  it('3-2. Reviews - updateReviewByOrderId, ordersId에 null/undefined가 할당된채로 전달받아 에러를 반환함', async () => {
    const ordersId = null || undefined
    const stars = '3'
    const review = '국밥은 국밥이 아닙니다!'
    // const updateReviewDto:UpdateReviewDto = {
    //   stars: '3',
    //   review: '국밥은 국밥이 아닙니다!'
    // }
    const returnedOriginalValue = {
      ordersId: 1,
      stars: '5',
      review: '국밥은 국밥입니다!'
    }
    // const returnedUpdatedValue = {
    //   ordersId: 1,
    //   stars: updateReviewDto.stars,
    //   review: updateReviewDto.review
    // }

      const returnedUpdatedValue = {
      ordersId: 1,
      stars: '3',
      review: '국밥은 국밥이 아닙니다!'
    }
    reviewsRepository.findOne.mockResolvedValue(returnedOriginalValue)
    reviewsRepository.save.mockResolvedValue(returnedUpdatedValue)

    return await expect(service.updateReviewByOrderId(ordersId, stars, review)).rejects.toThrow()
  })

  it('3-3. Reviews - updateReviewByOrderId, updateReviewDto에 null/undefined 만 할당된채로 전달받아 에러를 반환함', async () => {
    const ordersId = 1
    const stars = null
    const review = undefined
    // const updateReviewDto:UpdateReviewDto = {
    //   stars: '',
    //   review: ''
    // }
    const returnedOriginalValue = {
      ordersId: 1,
      stars: '5',
      review: '국밥은 국밥입니다!'
    }
    // const returnedUpdatedValue = {
    //   ordersId: 1,
    //   stars: updateReviewDto.stars,
    //   review: updateReviewDto.review
    // }

      const returnedUpdatedValue = {
      ordersId: 1,
      stars: '3',
      review: '국밥은 국밥이 아닙니다!'
    }
    reviewsRepository.findOne.mockResolvedValue(returnedOriginalValue)
    reviewsRepository.save.mockResolvedValue(returnedUpdatedValue)

    return await expect(service.updateReviewByOrderId(ordersId, stars, review)).rejects.toThrow()
  })

  it('4-1. Reviews - deleteReviewByOrderId,  orderId를 전달받아 해당되는 리뷰를 삭제함 << 얘 왜 true를 반환하고 있지?', async () => {
    const ordersId = 1
 
    const returnedValue = '리뷰가 삭제되었습니다.'
    reviewsRepository.delete.mockResolvedValue(returnedValue)

    return await expect(service.deleteReviewByOrderId(ordersId)).resolves.toBe(returnedValue)
  })

  it('4-2. Reviews - deleteReviewByOrderId,  orderId에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    const ordersId = null || undefined
 
    const returnedValue = '리뷰가 삭제되었습니다.'
    reviewsRepository.delete.mockResolvedValue(returnedValue)

    return await expect(service.deleteReviewByOrderId(ordersId)).rejects.toThrow()
  })

});

import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './carts.service';
import { Goods } from '../goods/entities/goods.entity';
import { Carts } from './entities/carts.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { validation } from '../configs/validationPipe';

describe('CartService', () => {
  let service: CartService;
  let goodsRepository: Partial<Record<keyof Repository<Goods>, jest.Mock>>;
  let cartsRepository: Partial<Record<keyof Repository<Carts>, jest.Mock>>;

  beforeEach(async () => {
    const goodsRepository = {
      findOne: jest.fn(),
    }
    const cartsRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Goods),
          useValue: goodsRepository
        },
        {
          provide: getRepositoryToken(Carts),
          useValue: cartsRepository
        }
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('CartService Module', () => {
    expect(service).toBeDefined();
  });

  // it('1-1. Carts - addToCart, userId & goodsId & createCartDto를 전달받아 장바구니 정보를 생성함', async () => {
  //   const userId = 1
  //   const goodsId = 1
  //   const createCartDto: CreateCartDto = {
  //     count: 7
  //   }

  //   await validation(CreateCartDto, createCartDto)

  //   const returnValue = '장바구니에 올라갈 상품'

  //   goodsRepository.findOne.mockResolvedValueOnce()
  //   cartsRepository.create.mockReturnValueOnce(returnValue)
  //   cartsRepository.create.mockResolvedValueOnce()
  // })

  // it('1-2. Carts - addToCart, userId 나 goodsId가 0 || null || undefined 가 할당된채 전달받아 에러를 반환함(BadRequestException)', async () => {})

  // it('1-3. Carts - addToCart, goodsId와 일치하는 상품을 조회하지 못해 에러를 반환함', async () => {})

  // it('1-4. Carts - addToCart, createCartDto가 불완전한 상태로(count == 0 포함) 전달받아 에러를 반환함', async () => {})

  // it('2-1. Carts - removeFromCart, userId & cartId를 전달받아 장바구니에서 해당되는 상품을 삭제함', async () => {
  // })

  // it('2-2. Carts - removeFromCart, userId나 cartId 중 하나 이상에 0 || null || undefined를 전달받아 에러를 반환함', async () => {
  // })

  // it('2-3. Carts - removeFromCart, cartId에 해당하는 상품정보가 장바구니에 존재하지 않아서 에러를 반환함', async () => {
  // })
});

import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './carts.controller';
import { CartService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { validation } from '../configs/validationPipe';

describe('CartController', () => {
  let controller: CartController;
  let cartService = {
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    getCartItems: jest.fn(),
    clearCart: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: cartService
        }
      ]
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('CartController Module', () => {
    expect(controller).toBeDefined();
  });

  it('1-1. Cart - addToCart, userId & goodsId & createCartDto를 전달받아 장바구니 정보를 생성함', async () => {
    const req = {
      user: {
        id: 1,
        role: 0
      }
    }
    const goodsId = 1
    const userId = req.user.id
    const createCartDto:CreateCartDto = {
      count: 7
    }

    await validation(CreateCartDto, createCartDto)

    const returnValue = `생성된 장바구니 정보`
    cartService.addToCart.mockReturnValueOnce(returnValue)

    return expect(controller.addToCart(userId, goodsId, createCartDto)).toBe(returnValue)
  })

  it('1-2. Cart - addToCart, createCartDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
    const req = {
      user: {
        id: 1,
        role: 0
      }
    }
    // const goodsId = 1
    // const userId = req.user.id
    const createCartDto:CreateCartDto = {
      count: undefined || null
    }

   return await validation(CreateCartDto, createCartDto).then(() => {
      throw new Error('잘못된 테스트입니다.')
    }).catch((err) => expect(err))

  })

  it('2-1. Cart - removeFromCart, cartId & userId를 전달받아 장바구니에서 정보를 삭제함?', () => {
    const req = {
      user: {
        id: 1,
        role: 0
      }
    }
    const userId = req.user.id
    const cartId = 1

    const returnValue = '장바구니가 성공적으로 삭제되었습니다.'
    cartService.removeFromCart.mockReturnValueOnce(returnValue)

    return expect(controller.removeFromCart(userId, cartId)).toBe(returnValue)
  })

  it('3-1. Cart - updateQuantity, userId & cartId & count를 전달받아 장바구니 속 품목의 수량 정보를 수정함', () => {
    const req = {
      user: {
        id: 1,
        role: 0
      }
    }
    const userId = req.user.id
    const cartId = 1
    const count = 7

    const returnValue = `장바구니 속 품목 ${cartId}의 수량이 ${count}로 수정되었습니다.`
    cartService.updateQuantity.mockReturnValueOnce(returnValue)

    return expect(controller.removeFromCart(userId, cartId, count)).toBe(returnValue)
  })

  it('4-1. Cart - getCartItems, userId를 전달받아 해당 유저의 장바구니를 조회함', () => {
    const req = {
      user: {
        id: 1,
        role: 0
      }
    }
    const userId = req.user.id

    const returnValue = `userId = ${userId} 유저의 장바구니 정보입니다.`
    cartService.updateQuantity.mockReturnValueOnce(returnValue)

    return expect(controller.getCartItems(userId)).toBe(returnValue)
  })

  it('5-1. Cart - clearCart, userId를 전달받아 해당 유저의 장바구니를 초기화함', () => {
    const req = {
      user: {
        id: 1,
        role: 0
      }
    }
    const userId = req.user.id

    const returnValue = `userId = ${userId} 유저의 장바구니를 초기화했습니다..`
    cartService.updateQuantity.mockReturnValueOnce(returnValue)

    return expect(controller.getCartItems(userId)).toBe(returnValue)
  })
});

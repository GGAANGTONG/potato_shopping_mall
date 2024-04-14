import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Carts } from './entities/carts.entity';
import { Goods } from '../goods/entities/goods.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { Users } from '../user/entities/user.entitiy';
import { Point } from '../point/entities/point.entity';
import { Payments } from '../payments/entities/payments.entity';
import { Orders } from './entities/orders.entity';
import _ from 'lodash';
import logger from 'src/common/log/logger';
import { validation } from 'src/common/pipe/validationPipe';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Carts)
    private cartsRepository: Repository<Carts>,
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,


  ) { }

  // 장바구니 추가
  async addToCart(
    userId: number,
    goodsId: number,
    createCartDto: CreateCartDto,
  ) {

    await validation(CreateCartDto, createCartDto)

    if (_.isNil(userId) || userId == 0 || _.isNil(goodsId) || goodsId == 0) {
      const error = new BadRequestException('잘못된 요청입니다!') 
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}, createCartDto = ${JSON.stringify(createCartDto)}`)
      throw error
    }

    const { ctCount } = createCartDto;

    const goods = await this.goodsRepository.findOne({
      relations: ['stock'],
      where: {
        id: goodsId,
      },
    });
    if (!goods) {
      const error = new BadRequestException('존재하지 않는 상품입니다.'); 
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}, createCartDto = ${JSON.stringify(createCartDto)}, goods = ${goods}`)
      throw error
    }

    const count = goods.stock.count - ctCount;

    if (count < 0) {
      const error = new BadRequestException('재고가 없습니다.'); 
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}, createCartDto = ${JSON.stringify(createCartDto)}`)
      throw error
    }


    const existingCartItem = await this.cartsRepository.findOne({
      where: {
        user_id: userId,
        goods_id: goodsId
      },
    });

    if (existingCartItem) {
      // 이미 장바구니에 있는 상품인 경우 수량만 업데이트
      const updateCount = existingCartItem.ct_count + ctCount;
      return await this.cartsRepository.update({ id: existingCartItem.id }, { ct_count: updateCount })
    }
    // 장바구니에 없는 상품인 경우 새로운 장바구니 아이템 생성
    const newCartItem = this.cartsRepository.create({
      user_id: userId,
      goods_id: goodsId,
      ct_count: ctCount,
      ct_price: goods.g_price,
    });
    return await this.cartsRepository.save(newCartItem);

  }


  // 장바구니 특정 상품 삭제(cartId를 goodsId로 바꾸는게 나을 거 같은데<-완료)
  async removeFromCart(userId: number, goodsId: number) {
    if (_.isNil(userId) || userId == 0 || _.isNil(goodsId) || goodsId == 0) {
      const error = new BadRequestException('잘못된 요청입니다!') 
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}`)
      throw error
    }

    const cartInfo = await this.cartsRepository.findOne({
      where: {
        goods_id: goodsId,
        id: userId
      }
    })

    if (!cartInfo) {
      const  error = new NotFoundException('장바구니에 해당 상품이 존재하지 않습니다.');
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}, cartInfo = ${JSON.stringify(cartInfo)}`)
      throw error
    }

    await this.cartsRepository.delete(
      {
        goods_id: goodsId,
        id: userId
      });

    return {
      message: '상품이 장바구니에서 삭제되었습니다.',
      data: cartInfo
    }
  }

  // 장바구니 특정 상품 수량 변경
  async updateQuantity(userId: number, cartId: number, ctCounts: number): Promise<Carts> {

    if (_.isNil(userId) || userId == 0 || _.isNil(cartId) || cartId == 0 || _.isNil(ctCounts) || ctCounts == 0) {
      const error = new BadRequestException('잘못된 요청입니다!') 
      logger.errorLogger(error, `userId = ${userId}, cartId = ${cartId}`)
      throw error
    }

    if (_.isNil(ctCounts) || ctCounts == 0) {
      const error = new BadRequestException('변경할 수량을 입력해 주세요.') 
      logger.errorLogger(error, `userId = ${userId}, cartId = ${cartId}, ctCounts = ${ctCounts}`)
      throw error
    }

    const cartItem = await this.cartsRepository.findOne({
      where: { id: cartId },
    });

    if (!cartItem) {
      const  error = new NotFoundException('장바구니에 상품을 찾을 수 없습니다.');
      logger.errorLogger(error, `userId = ${userId}, cartId = ${cartId}, cartItem = ${JSON.stringify(cartItem)}`)
      throw error
    }

    cartItem.ct_count = ctCounts;
    const goods = await this.goodsRepository.findOne({
      where: { id: cartItem.goods_id },
    });
    if (!goods) {
      const  error = new NotFoundException('해당 상품을 찾을 수 없습니다.');
      logger.errorLogger(error, `userId = ${userId}, cartId = ${cartId}, cartItem = ${JSON.stringify(cartItem)}, goods = ${goods}`)
      throw error
    }
    cartItem.ct_price = ctCounts * goods.g_price; // 상품 가격과 수량을 곱하여 총 가격 업데이트

    return this.cartsRepository.save(cartItem);
  }

  //소비자 장바구니의 모든 상품 조회
  async getCartItems(userId: number): Promise<Carts[]> {

    if (_.isNil(userId) || userId == 0) {
      const error = new BadRequestException('잘못된 요청입니다!') 
      logger.errorLogger(error, `userId = ${userId}`)
      throw error
    }

    const carts = await this.cartsRepository.find({
      where: { id: userId, },
    });

    return carts
  }


  //장바구니 비우기
  async clearCart(userId: number): Promise<void> {
    if (_.isNil(userId) || userId == 0) {
      const error = new BadRequestException('잘못된 요청입니다!') 
      logger.errorLogger(error, `userId = ${userId}`)
      throw error
    }
    await this.cartsRepository.delete({ id: userId });
  }
}

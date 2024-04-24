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
import logger from '../common/log/logger';
import { validation } from '../common/pipe/validationPipe';
import { Stocks } from '../goods/entities/stocks.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Carts)
    private cartsRepository: Repository<Carts>,
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(Stocks)
    private stocksRepository: Repository<Stocks>,


  ) { }

  // 장바구니 추가
  async addToCart(userId: number, goodsId: number, createCartDto: CreateCartDto) {
    await validation(CreateCartDto, createCartDto);
  
    if (!userId || userId === 0 || !goodsId || goodsId === 0) {
      const error = new BadRequestException('잘못된 요청입니다!');
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}, createCartDto = ${JSON.stringify(createCartDto)}`);
      throw error;
    }
  
    const { ctCount } = createCartDto;
  
    const goods = await this.goodsRepository.createQueryBuilder("goods")
      .leftJoinAndSelect("goods", "stock")
      .where("goods.id = :goodsId", { goodsId })
      .getOne();
  
    if (!goods) {
      const error = new BadRequestException('존재하지 않는 상품입니다.');
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}, createCartDto = ${JSON.stringify(createCartDto)}, goods = ${goods}`);
      throw error;
    }
  
    const stocks = await this.stocksRepository.createQueryBuilder("stock")
      .where("stock.goods_id = :goodsId", { goodsId })
      .getOne();
  
    const newStockCount = stocks.count - ctCount;
    if (newStockCount < 0) {
      const error = new BadRequestException('재고가 없습니다.');
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}, createCartDto = ${JSON.stringify(createCartDto)}`);
      throw error;
    }
  
    const existingCartItem = await this.cartsRepository.createQueryBuilder("cart")
      .where("cart.user_id = :userId AND cart.goods_id = :goodsId", { userId, goodsId })
      .getOne();
  
    if (existingCartItem) {
      const updateCount = existingCartItem.ct_count + ctCount;
      await this.cartsRepository.createQueryBuilder()
        .update(Carts)
        .set({ ct_count: updateCount })
        .where("id = :id", { id: existingCartItem.id })
        .execute();
      return await this.cartsRepository.findOne({ where: { id: existingCartItem.id } });
    }
  
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
    if (!userId || userId === 0 || !goodsId || goodsId === 0) {
      const error = new BadRequestException('잘못된 요청입니다!');
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}`);
      throw error;
    }
  
    const cartInfo = await this.cartsRepository.createQueryBuilder("cart")
      .where("cart.goods_id = :goodsId AND cart.user_id = :userId", { goodsId, userId })
      .getOne();
  
    if (!cartInfo) {
      const error = new NotFoundException('장바구니에 해당 상품이 존재하지 않습니다.');
      logger.errorLogger(error, `userId = ${userId}, goodsId = ${goodsId}, cartInfo = ${cartInfo}`);
      throw error;
    }
  
    await this.cartsRepository.createQueryBuilder()
      .delete()
      .from(Carts)
      .where("goods_id = :goodsId AND user_id = :userId", { goodsId, userId })
      .execute();
  
    return {
      message: '상품이 장바구니에서 삭제되었습니다.',
      data: cartInfo
    }
  }
  

  // 장바구니 특정 상품 수량 변경
  async updateQuantity(userId: number, cartId: number, ctCounts: number): Promise<Carts> {
    if (!userId || userId === 0 || !cartId || cartId === 0 || !ctCounts || ctCounts <= 0) {
      const error = new BadRequestException('잘못된 요청입니다!');
      logger.errorLogger(error, `userId = ${userId}, cartId = ${cartId}, ctCounts = ${ctCounts}`);
      throw error;
    }
  
    const cartItem = await this.cartsRepository.createQueryBuilder("cart")
      .where("cart.id = :cartId AND cart.user_id = :userId", { cartId, userId })
      .getOne();
  
    if (!cartItem) {
      const error = new NotFoundException('장바구니에 상품을 찾을 수 없습니다.');
      logger.errorLogger(error, `userId = ${userId}, cartId = ${cartId}`);
      throw error;
    }
  
    const goods = await this.goodsRepository.createQueryBuilder("goods")
      .where("goods.id = :goodsId", { goodsId: cartItem.goods_id })
      .getOne();
  
    if (!goods) {
      const error = new NotFoundException('해당 상품을 찾을 수 없습니다.');
      logger.errorLogger(error, `userId = ${userId}, cartId = ${cartId}, goodsId = ${cartItem.goods_id}`);
      throw error;
    }
  
    await this.cartsRepository.createQueryBuilder()
      .update(Carts)
      .set({
        ct_count: ctCounts,
        ct_price: ctCounts * goods.g_price
      })
      .where("id = :cartId AND user_id = :userId", { cartId, userId })
      .execute();
  
    return this.cartsRepository.createQueryBuilder("cart")
      .where("cart.id = :cartId", { cartId })
      .getOne();
  }
  

  //소비자 장바구니의 모든 상품 조회
  async getCartItems(userId: number): Promise<Carts[]> {
    if (_.isNil(userId) || userId === 0) {
      const error = new BadRequestException('잘못된 요청입니다!');
      logger.errorLogger(error, `userId = ${userId}`);
      throw error;
    }
  
    const carts = await this.cartsRepository.createQueryBuilder("cart")
      .where("cart.user_id = :userId", { userId })
      .getMany();
  
    return carts;
  }
  


  //장바구니 비우기
  async clearCart(userId: number): Promise<void> {
    if (_.isNil(userId) || userId === 0) {
      const error = new BadRequestException('잘못된 요청입니다!');
      logger.errorLogger(error, `userId = ${userId}`);
      throw error;
    }

    await this.cartsRepository.createQueryBuilder()
      .delete()
      .from(Carts)
      .where("user_id = :userId", { userId })
      .execute();
  }
}
  

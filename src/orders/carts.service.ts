import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carts } from './entities/carts.entity';
import { Goods } from '../goods/entities/goods.entity';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Carts)
    private cartsRepository: Repository<Carts>,
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>,
  ) {}

  // 장바구니 추가
  async addToCart(
    userId: number,
    goodsId: number,
    createCartDto: CreateCartDto,
  ) {
    const { count } = createCartDto;

    const goods = await this.goodsRepository.findOne({
      where: { id: goodsId },
    });
    if (!goods) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    const existingCartItem = await this.cartsRepository.findOne({
      where: { user_id: userId, goods_id: goodsId },
    });

    if (existingCartItem) {
      // 이미 장바구니에 있는 상품인 경우 수량만 업데이트
      existingCartItem.ct_count += count;
      existingCartItem.ct_total_price += count * goods.g_price; // 상품 가격과 수량을 곱하여 총 가격 업데이트
      return this.cartsRepository.save(existingCartItem);
    } else {
      // 장바구니에 없는 상품인 경우 새로운 장바구니 아이템 생성
      const newCartItem = this.cartsRepository.create({
        user_id: userId,
        goods_id: goodsId,
        ct_count: count,
        ct_total_price: count * goods.g_price, // 상품 가격과 수량을 곱하여 총 가격 설정
      });
      return this.cartsRepository.save(newCartItem);
    }
  }

  // 장바구니 특정 상품 삭제
  async removeFromCart(cartId: number): Promise<void> {
    await this.cartsRepository.delete(cartId);
  }

  // 장바구니 특정 상품 수량 변경
  async updateQuantity(cartId: number, count: number): Promise<Carts> {
    const cartItem = await this.cartsRepository.findOne({
      where: { id: cartId },
    });

    if (!cartItem) {
      throw new Error('장바구니에 상품을 찾을 수 없습니다.');
    }

    cartItem.ct_count = count;
    const goods = await this.goodsRepository.findOne({
      where: { id: cartItem.goods_id },
    });
    if (!goods) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    cartItem.ct_total_price = count * goods.g_price; // 상품 가격과 수량을 곱하여 총 가격 업데이트

    return this.cartsRepository.save(cartItem);
  }

  //소비자 장바구니의 모든 상품 조회
  async getCartItems(userId: number): Promise<Carts[]> {
    return this.cartsRepository.find({
      where: { user_id: userId },
      relations: ['goods'],
    });
  }
  //장바구니 비우기
  async clearCart(userId: number): Promise<void> {
    await this.cartsRepository.delete({ user_id: userId });
  }
}

import { PickType } from '@nestjs/swagger';
import { Goods } from '../entities/goods.entity';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoodDto extends PickType(Goods, [
  'g_name',
  'g_desc',
  'g_option',
] as const) {
  //g_price가 할인된 최종 가격으로 변경, cost_price가 원래 g_price 역할 (원가)
  @Type(() => Number)
  @IsNumber({}, { message: '상품 가격은 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '상품 가격은 양수로 입력되어야 합니다.' })
  cost_price: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  discount_rate: number;

  @Type(() => Number)
  @IsNumber({}, { message: '카테고리 id는 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '카테고리 id는 양수로 입력되어야 합니다.' })
  category: number;

  @Type(() => Number)
  @IsNumber({}, { message: '랙 id는 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '랙 id는 양수로 입력되어야 합니다.' })
  rack_id: number;
}

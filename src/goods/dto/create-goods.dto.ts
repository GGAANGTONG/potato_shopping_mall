import { PickType } from '@nestjs/swagger';
import { Goods } from '../entities/goods.entity';
import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoodDto extends PickType(Goods, [
  'g_name',
  'g_desc',
  'g_option',
] as const) {
  @Type(() => Number)
  @IsNumber({}, { message: '상품 가격은 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '상품 가격은 양수로 입력되어야 합니다.' })
  g_price: number;

  @Type(() => Number)
  @IsNumber({}, { message: '카테고리 id는 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '카테고리 id는 양수로 입력되어야 합니다.' })
  category: number;

  @Type(() => Number)
  @IsNumber({}, { message: '창고 id는 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '창고 id는 양수로 입력되어야 합니다.' })
  storage_id: number;
}

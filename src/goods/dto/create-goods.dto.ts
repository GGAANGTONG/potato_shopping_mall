import { PickType } from '@nestjs/swagger';
import { Goods } from '../entities/goods.entity';
import { IsNumber } from 'class-validator';

export class CreateGoodDto extends PickType(Goods, [
  'g_name',
  'g_price',
  'g_desc',
  'g_img',
  'g_option',
] as const) {
  @IsNumber()
  category: number;
}

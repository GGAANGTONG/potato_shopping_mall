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
  @IsNumber({}, { message: 'g_price must be a numeric value' })
  @IsPositive({ message: 'g_price must be a positive number' })
  g_price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'category must be a numeric value' })
  @IsPositive({ message: 'category must be a positive number' })
  category: number;
}

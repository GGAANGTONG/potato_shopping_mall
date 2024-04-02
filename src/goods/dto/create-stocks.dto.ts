import { PickType } from '@nestjs/swagger';
import { Stocks } from '../entities/stocks.entity';
import { IsNumber } from 'class-validator';

export class CreateStockDto extends PickType(Stocks, ['count'] as const) {
  @IsNumber()
  goods_id: number;
}

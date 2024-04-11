import { Stocks } from '../entities/stocks.entity';
import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockDto extends Stocks {
  @IsNumber()
  goods_id: number;

  @Type(() => Number)
  @IsNumber({}, { message: '카테고리 id는 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '카테고리 id는 양수로 입력되어야 합니다.' })
  count: number;

  @IsNumber()
  storage_id: number;
}

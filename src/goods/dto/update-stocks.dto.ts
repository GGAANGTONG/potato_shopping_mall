import { PickType } from '@nestjs/swagger';
import { Stocks } from '../entities/stocks.entity';

export class UpdateStockDto extends PickType(Stocks, ['count'] as const) {}

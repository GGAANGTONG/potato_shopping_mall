
import { IsArray } from 'class-validator';
import { Orders } from '../entities/orders.entity';
import { PickType } from '@nestjs/swagger';

export class CreateOrderDto extends PickType(Orders, [
  'o_addr',
  'o_detail_addr',
  'o_tel'
] as const) {
  @IsArray()
  carts_id: number[]

}

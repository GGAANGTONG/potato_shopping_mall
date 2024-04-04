import { PickType } from '@nestjs/swagger';
import { Orders } from '../entities/orders.entity';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateOrderDto extends PickType(Orders, [
  'o_tel',
  'o_addr',
  'o_count',
  'o_req',
] as const) {
  @IsNumber()
  goods_id: number;

}

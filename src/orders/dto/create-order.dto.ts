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

  @IsString()
  @IsNotEmpty()
  @Column()
  p_name: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  p_tel: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  p_addr: string;

  @IsNumber()
  @IsNotEmpty()
  @Column()
  p_count: number;

  @IsNumber()
  @IsNotEmpty()
  @Column()
  p_total_price: number;

  @IsBoolean()
  @Column()
  paid: boolean;
}

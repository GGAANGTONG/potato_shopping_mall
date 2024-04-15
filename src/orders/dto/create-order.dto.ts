
import { IsArray, IsNumber } from 'class-validator';


export class CreateOrderDto {
  @IsArray()
  carts_id: number[]

}

import { IsNumber } from "class-validator";


export class CreatePaymentDto {
    @IsNumber()
    orders_id: number;



}

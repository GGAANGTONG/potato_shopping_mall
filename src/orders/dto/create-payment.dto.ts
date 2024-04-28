import { IsNumber, IsString } from "class-validator";


export class CreatePaymentDto {
    @IsNumber()
    orders_id: number;
    
    @IsString()
    PayMethod: string;



}

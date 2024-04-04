import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PayStatus } from "../types/payments.type";

@Entity({ name: 'payments' })
export class Payments {
    @IsNumber()
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @IsNumber()
    @Column({ unsigned: true })
    user_id: number;

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

    @IsEnum(PayStatus)
    @IsNotEmpty()
    @Column({ type: 'enum', enum: PayStatus, default: '결제완료' })
    p_status: PayStatus;


}
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PayStatus } from "../types/payments.type";
import { Orders } from "src/orders/entities/orders.entity";

@Entity({ name: 'payments' })
export class Payments {
    @IsNumber()
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @IsNumber()
    @Column({ unsigned: true })
    user_id: number;

    @IsNumber()
    @Column({ unsigned: true })
    orders_id: number;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    p_total_price: number;

    @IsEnum(PayStatus)
    @IsNotEmpty()
    @Column({ type: 'enum', enum: PayStatus, default: '결제완료' })
    p_status: PayStatus;

    @OneToOne(() => Orders, (orders) => orders.payments)
    @JoinColumn({ name: 'orders_id', referencedColumnName: 'id' })
    orders: Orders;

}
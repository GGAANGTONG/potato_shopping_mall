import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PayMethod } from "../types/payments.type";
import { Orders } from "../../orders/entities/orders.entity";
import { UpdateCommentDto } from "src/boards/dto/update-comment.dto";

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

    // @IsEnum(PayStatus)
    // @IsNotEmpty()
    // @Column({ type: 'enum', enum: PayStatus, default: '결제완료' })
    // p_status: PayStatus;

    @IsEnum(PayMethod)
    @IsNotEmpty()
    @Column({ type: 'enum', enum: PayMethod, default: 'point' })
    paid_by: PayMethod;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => Orders, (orders) => orders.payments)
    @JoinColumn({ name: 'orders_id', referencedColumnName: 'id' })
    orders: Orders;

}
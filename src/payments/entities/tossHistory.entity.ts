import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PayMethod } from "../types/payments.type";
import { Orders } from "../../orders/entities/orders.entity";
import { UpdateCommentDto } from "src/boards/dto/update-comment.dto";

@Entity({ name: 'tosshistory' })
export class TossHistory {
    @IsNumber()
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @IsNumber()
    @Column({ unsigned: true })
    user_id: number;

    @IsNumber()
    @Column({ unsigned: true })
    orders_id: number;

    @IsString()
    @Column()
    toss_orders_id: string;

    @IsString()
    @Column({nullable: true})
    toss_transaction_key: string;

    @IsString()
    @Column({nullable: true})
    toss_payment_key: string;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    o_total_price: number;

    @IsNumber()
    @IsNotEmpty()
    @Column({default: 0})
    p_total_price: number;

    @IsBoolean()
    @IsNotEmpty()
    @Column({ type: 'boolean', default: false })
    p_status: boolean;


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Orders, (orders) => orders.payments)
    @JoinColumn({ name: 'orders_id', referencedColumnName: 'id' })
    orders: Orders;

}
import { IsNumber } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('Carts')
export class Cart {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ unsigned: true })
    user_Id: number;

    @Column({ unsigned: true })
    goods_Id: number;

    @Column({ unsigned: true })
    order_Id: number;

    @IsNumber()
    @Column()
    ct_count: number;

    @IsNumber()
    @Column()
    ct_totalprice: number;

    @CreateDateColumn()
    ct_date: Date;




}
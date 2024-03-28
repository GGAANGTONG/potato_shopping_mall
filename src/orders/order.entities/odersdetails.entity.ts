import { IsNumber } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('Ordersdetails')
export class Ordersdetail {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ unsigned: true })
    goods_Id: number;

    @Column({ unsigned: true })
    order_Id: number;

    @IsNumber()
    @Column()
    od_count: number;



}
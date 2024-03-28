import { IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('Orders')
export class Order {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ unsigned: true })
    user_Id: number;

    @IsString()
    @Column()
    o_name: string;

    @IsString()
    @Column()
    o_tel: string;

    @IsString()
    @Column()
    o_addr: string;

    @IsNumber()
    @Column()
    o_count: number;

    @IsNumber()
    @Column()
    o_totalprice: number;

    @IsString()
    @Column()
    o_req: string;

    @IsString()
    @Column()
    o_status: string;


    @CreateDateColumn()
    o_date: Date;




}
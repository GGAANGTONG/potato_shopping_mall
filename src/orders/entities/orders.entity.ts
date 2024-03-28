import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Goods } from "src/goods/entities/goods.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity({name: 'orders'})
export class Orders {

    @IsNumber()
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @IsNumber()
    @Column({ unsigned: true })
    user_id: number;

    @IsString()
    @IsNotEmpty()
    @Column()
    o_name: string;

    @IsString()
    @IsNotEmpty()
    @Column()
    o_tel: string;

    @IsString()
    @IsNotEmpty()
    @Column()
    o_addr: string;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    o_count: number;

    @IsNumber()
    @IsNotEmpty()
    @Column()
    o_total_price: number;

    @IsString()
    @Column({ nullable: true })
    o_req: string;

    //enum으로 바꾸면 좋을 것 같아요
    @IsString()
    @IsNotEmpty()
    @Column()
    o_status: string;

    @CreateDateColumn()
    o_date: Date;

    @UpdateDateColumn()
    updated_at: Date;


    @ManyToOne(() => Goods, (goods) => goods.orders, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "goods_id", referencedColumnName: "id" })
    goods: Goods;

}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Categories } from "./categories.entity";
import { Stocks } from "./stocks.entity";
import { Orders } from "../../orders/entities/orders.entity";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@Entity({ name: "goods" })
export class Goods {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsString()
  @Column({ type: "varchar", length: 100 })
  g_name: string;

  @IsNumber()
  @Column({ type: "int" })
  g_price: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 255 })
  g_desc: string;

  @IsString()
  @Column({ type: "varchar", length: 255, nullable: true })
  g_img: string | null;

  @IsString()
  @Column({ type: "varchar", length: 255, nullable: true })
  g_option: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Categories, (category) => category.goods)
  @JoinColumn({ name: "cate_id" })
  category: Categories;

  @OneToOne(() => Stocks, (stocks) => stocks.goods)
  stock: Stocks;

  @OneToMany(() => Orders, (orders) => orders.goods)
  orders: Orders[];
  
}

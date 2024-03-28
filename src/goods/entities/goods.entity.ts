import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Categories } from "./categories.entity";
import { Stocks } from "./stocks.entity";

@Entity({ name: "goods" })
export class Goods {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  g_name: string;

  @Column({ type: "int" })
  g_price: number;

  @Column({ type: "varchar", length: 255 })
  g_desc: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  g_img: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  g_option: string | null;

  @CreateDateColumn({ name: "createdAt" })
  created_at: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updated_at: Date;

  @ManyToOne(() => Categories, (category) => category.goods)
  @JoinColumn({ name: "cate_id" })
  category: Categories;

  @OneToOne(() => Stocks, (stocks) => stocks.goods)
  stock: Stocks;
}

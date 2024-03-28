import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Goods } from "./goods.entity";
import { IsNumber } from "class-validator";

@Entity({ name: "stocks" })
export class Stocks {

  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ type: "int" })
  count: number;

  @OneToOne(() => Goods, (goods) => goods.stock)
  @JoinColumn({ name: "goods_id" })
  goods: Goods;
}

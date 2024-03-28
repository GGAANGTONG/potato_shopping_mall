import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Goods } from "./goods.entity";

@Entity({ name: "stocks" })
export class Stocks {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Goods, (goods) => goods.stock)
  @JoinColumn({ name: "goods_id" })
  goods: Goods;

  @Column({ type: "int" })
  count: number;
}

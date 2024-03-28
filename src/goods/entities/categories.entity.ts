import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Goods } from "./goods.entity";

@Entity({ name: "categories" })
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  c_name: string;

  @Column({ type: "varchar", length: 255 })
  c_desc: string;

  @OneToMany(() => Goods, (goods) => goods.category)
  goods: Goods[];
}

import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Goods } from "./goods.entity";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@Entity({ name: "categories" })
export class Categories {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 100 })
  c_name: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 255 })
  c_desc: string;

  @OneToMany(() => Goods, (goods) => goods.category)
  goods: Goods[];
}

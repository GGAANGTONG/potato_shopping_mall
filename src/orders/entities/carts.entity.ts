import { IsNumber } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "carts" })
export class Carts {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @Column({ unsigned: true })
  user_id: number;

  @IsNumber()
  @Column({ unsigned: true })
  goods_id: number;

  @IsNumber()
  @Column({ unsigned: true })
  order_id: number;

  @IsNumber()
  @Column()
  ct_count: number;

  @IsNumber()
  @Column()
  ct_total_price: number;

  @CreateDateColumn()
  ct_date: Date;
}

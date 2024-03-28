import { IsNumber } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "ordersdetails" })
export class Ordersdetails {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @Column({ unsigned: true })
  goods_id: number;

  @IsNumber()
  @Column({ unsigned: true })
  order_id: number;

  @IsNumber()
  @Column()
  od_count: number;
}

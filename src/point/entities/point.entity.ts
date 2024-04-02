import { IsNotEmpty, IsNumber } from "class-validator";
import { Users } from "src/user/entities/user.entitiy";

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({
  name: "point",
})
export class Point {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ type: "int" })
  possession: number;

  @CreateDateColumn()
  createdAt: Date;

  @IsNotEmpty()
  @IsNumber()
  @Column("int", { name: "userId" })
  userId: number;

  @ManyToOne(() => Users, (user) => user.point)
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: Users;
}

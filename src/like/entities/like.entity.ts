import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Users } from '../../user/entities/user.entitiy';
// import { Goods } from "src/goods/entities/goods.entity";

@Entity({ name: 'likes' })
export class Like {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int' })
  usersId: number;

  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int' })
  goodsId: number;

  @CreateDateColumn()
  created_at: Date;

  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  @ManyToOne(() => Users, (user) => user.like)
  user: Users;

  // @JoinColumn([{ name: "goodsId", referencedColumnName: "id" }])
  // @ManyToOne(() => Goods, (goods) => goods.like)
  // goods: Goods;
}

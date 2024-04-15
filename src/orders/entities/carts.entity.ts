import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Goods } from '../../goods/entities/goods.entity';
import { Users } from '../../user/entities/user.entitiy';

@Entity({ name: 'carts' })
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
  @Column()
  ct_count: number;

  @IsNumber()
  @Column()
  ct_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


  @ManyToOne(() => Goods, (goods) => goods.carts, { onDelete: 'CASCADE', })
  @JoinColumn({ name: 'goods_id', referencedColumnName: 'id' })
  goods: Goods;

  @ManyToOne(() => Users, (user) => user.carts, { onDelete: 'CASCADE', })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;
}

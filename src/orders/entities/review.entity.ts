import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Orders } from './orders.entity';

@Entity({ name: 'reviews' })
export class Reviews {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @Column({ unsigned: true })
  orders_id: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  stars: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'text' })
  review: string;

  @OneToOne(() => Orders, (orders) => orders.reviews)
  @JoinColumn({ name: 'orders_id', referencedColumnName: 'id' })
  orders: Orders;
}

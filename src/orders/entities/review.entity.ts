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

  @OneToOne(() => OrdersDetails, (ordersdetails) => ordersdetails.reviews, { onDelete: 'CASCADE' })
  ordersdetails: OrdersDetails;
}

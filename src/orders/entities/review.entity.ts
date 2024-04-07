import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrdersDetails } from './ordersdetails.entity';

@Entity({ name: 'reviews' })
export class Reviews {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @Column({ unsigned: true })
  ordersdetails_id: number;

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

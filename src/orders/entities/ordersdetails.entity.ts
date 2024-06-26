import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';
import { Goods } from '../../goods/entities/goods.entity';
import { Reviews } from './review.entity';

@Entity({ name: 'ordersdetails' })
export class OrdersDetails {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;


  @IsNumber()
  @IsNotEmpty()
  @Column({ unsigned: true })
  orders_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Column({ unsigned: true })
  goods_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Column()
  od_count: number;

  //od_status 장바구니 상태인지, 주문건인지

  @ManyToOne(() => Orders, (orders) => orders.ordersdetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orders_id', referencedColumnName: 'id' })
  orders: Orders;

  @ManyToOne(() => Goods, (goods) => goods.ordersdetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'goods_id', referencedColumnName: 'id' })
  goods: Goods;

  @OneToOne(() => Reviews, (reviews) => reviews.ordersdetails)
  reviews: Reviews;
}

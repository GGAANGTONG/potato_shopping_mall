import { IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Orders } from './orders.entity';
import { Goods } from 'src/goods/entities/goods.entity';

@Entity({ name: 'ordersdetails' })
export class OrdersDetails {
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
  // ----------------진영님이랑 굿즈 관계설정*----------------------
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Categories } from './categories.entity';
import { Stocks } from './stocks.entity';
import { OrdersDetails } from '../../orders/entities/ordersdetails.entity';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Carts } from '../../orders/entities/carts.entity';
import { Racks } from '../../storage/entities/rack.entity';

@Entity({ name: 'goods' })
export class Goods {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsString()
  @Column({ type: 'varchar', length: 100 })
  g_name: string;

  @IsNumber()
  @Column({ type: 'int' })
  g_price: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 })
  g_desc: string;

  @IsString()
  @Column({ type: 'varchar', length: 255, nullable: true })
  g_img: string | null;

  @IsString()
  @Column({ type: 'varchar', length: 255, nullable: true })
  g_option: string | null;

  //할인율
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'float' })
  discount_rate: number;

  //원가
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', nullable: true })
  cost_price: number;

  @IsBoolean()
  @Column({ type: 'boolean', default:true })
  g_state: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Categories, (category) => category.goods)
  @JoinColumn({ name: 'cate_id' })
  category: Categories;

  @OneToMany(() => OrdersDetails, (ordersdetails) => ordersdetails.goods)
  ordersdetails: OrdersDetails[];

  @OneToMany(() => Carts, (carts) => carts.goods)
  carts: Carts[];
}

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../types/order.type';
import { Reviews } from './review.entity';
import { Users } from '../../user/entities/user.entitiy';
import { OrdersDetails } from './ordersdetails.entity';

@Entity({ name: 'orders' })
export class Orders {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @Column({ unsigned: true })
  user_id: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  o_name: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  o_tel: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  o_addr: string;

  @IsNumber()
  @IsNotEmpty()
  @Column()
  o_count: number;

  @IsNumber()
  @IsNotEmpty()
  @Column()
  o_total_price: number;

  @IsString()
  @Column({ nullable: true })
  o_req: string;

  //enum으로 바꾸면 좋을 것 같아요
  @IsEnum(Status)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: Status, default: '주문완료' })
  o_status: Status;

  @CreateDateColumn()
  o_date: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;

  @OneToMany(() => OrdersDetails, (ordersdetails) => ordersdetails.orders)
  ordersdetails: OrdersDetails[];


}

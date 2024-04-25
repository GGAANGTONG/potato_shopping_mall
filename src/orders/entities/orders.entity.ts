import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
import { Users } from '../../user/entities/user.entitiy';
import { OrdersDetails } from './ordersdetails.entity';
import { Payments } from '../../payments/entities/payments.entity';

@Entity({ name: 'orders' })
export class Orders {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @Column({ unsigned: true })
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Column()
  o_total_price: number;

  @IsString()
  @IsNotEmpty()
  @Column({nullable: true })
  o_tel: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  o_addr: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  o_detail_addr: string;

  //enum으로 바꾸면 좋을 것 같아요
  @IsEnum(Status)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: Status, default: '주문완료' })
  o_status: Status;

  @IsBoolean()
  @IsNotEmpty()
  @Column({ default: false })
  p_status: boolean;

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  updated_At: Date;

  @ManyToOne(() => Users, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;

  @OneToMany(() => OrdersDetails, (ordersdetails) => ordersdetails.orders)
  ordersdetails: OrdersDetails[];

  @OneToOne(() => Payments, (payments) => payments.orders)
  payments: Payments;


}
// @IsString()
// @IsNotEmpty()
// @Column()
// o_name: string;

// @IsString()
// @IsNotEmpty()
// @Column()
// o_tel: string;

// @IsString()
// @IsNotEmpty()
// @Column()
// o_addr: string;

// @IsNumber()
// @IsNotEmpty()
// @Column()
// o_count: number;

// @IsString()
// @Column({ nullable: true })
// o_req: string;
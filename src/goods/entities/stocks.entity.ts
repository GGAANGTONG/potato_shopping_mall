import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Goods } from './goods.entity';
import { Racks } from '../../storage/entities/rack.entity';
import { IsNumber } from 'class-validator';

@Entity({ name: 'stocks' })
export class Stocks {
  @PrimaryGeneratedColumn()
  id: number;
  
  @IsNumber()
  @Column({ type: 'int' })
  count: number; // 창고에 저장된 상품의 수량

  @ManyToOne(() => Goods, (goods) => goods.stock)
  @JoinColumn({ name: 'goods_id' })
  goods: Goods;

  @ManyToOne(() => Racks, (rack) => rack.stock)
  @JoinColumn({ name: 'rack_id' })
  rack: Racks;
}

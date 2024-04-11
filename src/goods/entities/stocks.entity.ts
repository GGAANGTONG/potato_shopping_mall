import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Goods } from './goods.entity';
import { Storage } from '../../storage/entities/storage.entity';

@Entity({ name: 'stocks' })
export class Stocks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  count: number; // 창고에 저장된 상품의 수량

  @ManyToOne(() => Goods, (goods) => goods.stock)
  @JoinColumn({ name: 'goods_id' })
  goods: Goods;

  @ManyToOne(() => Storage, (storage) => storage.stock)
  @JoinColumn({ name: 'storage_id' })
  storage: Storage;
}

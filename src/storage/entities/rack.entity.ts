import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Storage } from './storage.entity';
import { Goods } from '../../goods/entities/goods.entity';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Stocks } from '../../goods/entities/stocks.entity';

@Entity()
export class Racks {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @IsString()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  location_info: string | null;

  @ManyToOne(() => Storage, (storage) => storage.racks)
  @JoinColumn({ name: 'storage_id' })
  storage: Storage;

  @OneToMany(() => Stocks, (stocks) => stocks.rack)
  stock: Stocks[];
}
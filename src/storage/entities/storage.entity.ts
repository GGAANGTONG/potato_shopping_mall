import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Racks } from './rack.entity';
import { Stocks } from '../../goods/entities/stocks.entity';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Racks, (racks) => racks.storage)
  racks: Racks[];

  @OneToMany(() => Stocks, (stocks) => stocks.storage)
  stock: Stocks[];
}

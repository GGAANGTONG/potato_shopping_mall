import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Storage } from './storage.entity';

@Entity()
export class Racks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /* 최대 수량 */
  @Column({ type: 'int', name: 'capacity' })
  capacity: number;

  @Column({ type: 'int', default: 0, name: 'current_stock' })
  currentStock: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'location_info',
  })
  locationInfo: string | null;

  @ManyToOne(() => Storage, (storage) => storage.racks)
  @JoinColumn({ name: 'storage_id' })
  storage: Storage;
}

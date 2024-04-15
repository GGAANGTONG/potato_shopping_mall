import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Racks } from './rack.entity';
import { IsBoolean, IsString } from 'class-validator';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsString()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @IsString()
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @IsString()
  @Column({ type: 'varchar', length: 20, nullable: true })
  postal_code: string;

  @IsString()
  @Column({ type: 'varchar', length: 100, nullable: true })
  contact_name: string;

  @IsString()
  @Column({ type: 'varchar', length: 50, nullable: true })
  contact_phone: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: true })
  is_available: boolean;

  @OneToMany(() => Racks, (racks) => racks.storage)
  racks: Racks[];

}


import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../type/user_role.type';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;
  
  @Column({ type: 'varchar', nullable: false })
  nickname: string;

  @Column({ type: 'text', nullable: true })
  profile?: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;


}
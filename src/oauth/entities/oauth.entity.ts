import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  import { Users } from '../../user/entities/user.entitiy';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

  @Entity({ name: 'oauth' })
  export class Oauth {
    @IsNumber()
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;
  
    @IsEmail()
    @IsNotEmpty()
    @Column({ type: 'varchar', unique: true })
    email: string;
  
    @IsNotEmpty()
    @Column({ type: 'varchar', select: false })
    password: string;
  
    @IsString()
    @IsNotEmpty()
    @Column({ type: 'varchar' })
    nickname: string;
  
    @Column({ type: 'varchar', nullable: false })
    birth: string;
  
    @Column({ type: 'varchar', select: true, nullable: false, default: 'local' })
    provider: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    @OneToOne(() => Users, (user) => user.id)
    @JoinColumn({ name: 'id' })
    user: Users;
  }

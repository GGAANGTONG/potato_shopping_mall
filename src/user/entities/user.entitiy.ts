import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../type/user_role.type';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { Like } from '../../like/entities/like.entity';
import { Grade } from '../type/user_grade.type';
import { Orders } from '../../orders/entities/orders.entity';
import { Point } from '../../point/entities/point.entity';
import { Comments } from '../../boards/entities/comments.entity';
import { Boards } from '../../boards/entities/boards.entity';
import { Carts } from '../../orders/entities/carts.entity';

@Entity({ name: 'users' })
export class Users {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  name: string;

  @IsStrongPassword(
    {},
    {
      message:
        '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.',
    },
  )
  @IsNotEmpty()
  @Column({ type: 'varchar', select: false })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  nickname: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'text', nullable: true })
  profile?: string;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @IsEnum(Grade)
  @Column({ type: 'enum', enum: Grade, default: Grade.CUSTUMER })
  grade: Grade;

  @IsNumber()
  @Column({ type: 'int', default: 1000000 })
  points: number;

  @IsNumber()
  @Column({ type: 'int', nullable: true })
  bank: number;

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  @OneToMany(() => Point, (point) => point.user)
  point: Point[];

  @OneToMany(() => Orders, (orders) => orders.user)
  orders: Orders[];

  @OneToMany(() => Comments, (comments) => comments.user)
  comments: Comments[]

  @OneToMany(() => Boards, (boards) => boards.user)
  boards: Boards[]

  @OneToMany(() => Carts, (carts) => carts.user)
  carts: Carts[]
}

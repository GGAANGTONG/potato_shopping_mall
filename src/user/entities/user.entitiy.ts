import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../type/user_role.type";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";

import { Like } from "src/like/entities/like.entity";
import { Grade } from "../type/user_grade.type";
// import { Orders } from "src/orders/entities/orders.entity";

@Entity({ name: "users" })
export class Users {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar" })
  name: string;

  @IsStrongPassword(
    {},
    {
      message:
        "비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.",
    },
  )
  @IsNotEmpty()
  @Column({ type: "varchar", select: false })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: "varchar", unique: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar" })
  nickname: string;

  @IsString()
  @IsOptional()
  @Column({ type: "text", nullable: true })
  profile?: string;

  @IsEnum(Role)
  @Column({ type: "enum", enum: Role, default: Role.User })
  role: Role;

  @IsEnum(Grade)
  @Column({ type: "enum", enum: Grade, default: Grade.CUSTUMER })
  grade: Grade;

  @IsNumber()
  @Column({ type: "int", default: 1000000 })
  points: number;

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  // @OneToMany(() => Orders, (order) => order.user)
  // order: Orders[];
}

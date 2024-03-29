import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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

  @IsNumber()
  @Column({ type: "int", default: 1000000 })
  points: number;
}

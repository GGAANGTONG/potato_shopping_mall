import { IsNumber, IsNotEmpty, IsString } from "class-validator";
import { Users } from "src/user/entities/user.entitiy";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { Boards } from "./boards.entity";

@Entity({name: 'comments'})
export class Comments {
  
  @IsNumber()
  @PrimaryGeneratedColumn({unsigned: true})
  id: number

  @IsNumber()
  @IsNotEmpty()
  @Column({unsigned: true})
  user_id: number

  @IsNumber()
  @IsNotEmpty()
  @Column({unsigned: true})
  board_id: number


  @IsString()
  @IsNotEmpty()
  @Column({type: 'varchar', length: 100})
  content: string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Boards, (board) => board.comments)
  @JoinColumn({name: 'board_id', referencedColumnName: 'id'})
  board: Boards

  @ManyToOne(() => Users, (user) => user.comments)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user: Users


}

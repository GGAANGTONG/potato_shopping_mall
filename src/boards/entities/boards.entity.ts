import { IsNumber, IsNotEmpty, IsString, IsOptional, Min } from "class-validator";
import { Users } from "../../user/entities/user.entitiy";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Comments } from "./comments.entity";

@Entity({name: 'boards'})
export class Boards {
  
  @IsNumber()
  @Min(1)
  @PrimaryGeneratedColumn({unsigned: true})
  id: number

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Column({unsigned: true})
  user_id: number

  @IsString()
  @IsNotEmpty()
  @Column({type: 'varchar', length: 50})
  title: string

  @IsString()
  @IsNotEmpty()
  @Column({type: 'text'})
  content: string

  @IsString()
  @IsOptional()
  @Column({ type: 'text', nullable: true })
  b_img?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.boards)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user: Users

  @OneToMany(() => Comments, (comments) => comments.board)
  comments:Comments[]


}

import { IsInt, IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  ctCount: number;

}

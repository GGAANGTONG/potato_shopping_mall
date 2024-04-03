import { IsInt } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  count: number;
}

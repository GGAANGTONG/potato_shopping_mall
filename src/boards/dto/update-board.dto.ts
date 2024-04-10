import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  
  @IsNumber()
  @IsNotEmpty()
  id: number
}

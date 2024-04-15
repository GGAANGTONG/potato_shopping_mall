import { PickType } from '@nestjs/swagger';
import { Racks } from '../entities/rack.entity';
import { IsArray, IsNumber } from 'class-validator';

export class CreateRacksDto extends PickType(Racks, [
  'name',
  'location_info',
] as const) {
  @IsNumber()
  storage_id: number;
}

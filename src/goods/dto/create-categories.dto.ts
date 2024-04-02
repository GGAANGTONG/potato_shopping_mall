import { PickType } from '@nestjs/swagger';
import { Categories } from '../entities/categories.entity';

export class CreateCategoryDto extends PickType(Categories, [
  'c_name',
  'c_desc',
] as const) {}

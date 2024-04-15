import { PartialType } from '@nestjs/mapped-types';
import { CreateStorageDto } from './create-storage.dto';

export class UpdateRacksDto extends PartialType(CreateStorageDto) {}

import { PickType } from '@nestjs/swagger';
import { Storage } from '../entities/storage.entity';

export class CreateStorageDto extends PickType(Storage, [
  'name',
  'address',
  'postal_code',
  'contact_name',
  'contact_phone',
  'is_available',
] as const) {}

import { PartialType } from '@nestjs/swagger';
import { Users } from '../entities/user.entitiy';

export class UpdateDto extends PartialType(Users)


 {}

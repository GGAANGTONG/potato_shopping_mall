import { PickType } from '@nestjs/swagger';
import { Users } from '../entities/user.entitiy';

export class SignUpDto extends PickType(Users, [
  'name',
  'email',
  'password',
  'nickname',
  'profile',
]) {}

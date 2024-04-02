import { PickType } from '@nestjs/swagger';
import { Users } from '../entities/user.entitiy';

export class SignInDto extends PickType(Users, ['password', 'email']) {}

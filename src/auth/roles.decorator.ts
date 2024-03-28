

import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/type/user_role.type';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
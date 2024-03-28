import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { SignUpDto } from './dto/signup.dto';
import { Users } from './entities/user.entitiy';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Users> {
    return this.userService.create(signUpDto);
  }
}
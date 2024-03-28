import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { Users } from './entities/user.entitiy';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(signUpDto: SignUpDto): Promise<Users> {
    const user = this.usersRepository.create(signUpDto);
    await this.usersRepository.save(user);
    return user;
  }


  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}

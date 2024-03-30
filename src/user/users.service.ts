import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "./entities/user.entitiy";
import { compare, hash } from "bcrypt";
import _ from "lodash";
import { SignUpDto } from "./dto/signup.dto";
import { Sign_inDto } from "./dto/sign_in.dto";
import { updateDto } from "./dto/update.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUpDto: SignUpDto): Promise<Users> {
    const find_email = await this.findByEmail(signUpDto.email);
    if (find_email) {
      throw new ConflictException("이미 가입된 이메일 입니다.");
    }
    const hashed_password = await hash(signUpDto.password, 10);
    const user = await this.usersRepository.save({
      email: signUpDto.email,
      password: hashed_password,
      name: signUpDto.name,
      nickname: signUpDto.nickname,
      profile: signUpDto.profile,
    });
    return user;
  }

  async sign_in(sign_inDto: Sign_inDto) {
    const user = await this.usersRepository.findOne({
      select: ["id", "email", "password", "nickname", "profile", "name"],
      where: { email: sign_inDto.email },
    });
    if (_.isNull(user)) {
      throw new UnauthorizedException("이메일을 확인하세요.");
    }
    const compared_password = await compare(sign_inDto.password, user.password);
    if (!compared_password) {
      throw new UnauthorizedException("비밀번호를 확인하세요.");
    }
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: "7d",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async findAll(): Promise<Users[]> {
    const users = await this.usersRepository.find({
      order: {
        id: "asc",
      },
    });

    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({
      id,
    });
    if (_.isNil(user)) {
      throw new NotFoundException("해당 유저가 없습니다");
    }
    return user;
  }

  async update(id: number, updateDto: updateDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    const { nickname, profile, password } = updateDto;

    if (_.isNil(user)) {
      throw new NotFoundException("해당 유저가 없습니다");
    }

    if (!nickname && !profile) {
      throw new BadRequestException("수정할 값을 입력해주세요.");
    }

    if (nickname) user.nickname = nickname;
    if (profile) user.profile = profile;
    if (password) user.password = password;

    await this.usersRepository.save(user);

    return user;
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (_.isNil(user)) {
      throw new NotFoundException("해당 유저가 없습니다");
    }

    await this.usersRepository.remove(user);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Users } from './entities/user.entitiy';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';
import { SignUpDto } from './dto/signup.dto';

import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Point } from '../point/entities/point.entity';
import { SignInDto } from './dto/sign_in.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Point)
    private pointsRepository: Repository<Point>,
    private readonly jwtService: JwtService,
    private http: HttpService,
    private dataSource: DataSource,
  ) {}

  async register(signUpDto: SignUpDto): Promise<Users> {
    const findEmail = await this.findByEmail(signUpDto.email);
    if (findEmail) {
      throw new ConflictException('이미 가입된 이메일 입니다.');
    }
    const hashedPassword = await hash(signUpDto.password, 10);
    const user = await this.usersRepository.save({
      email: signUpDto.email,
      password: hashedPassword,
      name: signUpDto.name,
      nickname: signUpDto.nickname,
      profile: signUpDto.profile,
    });

    //포인트 등록

    const point = this.pointsRepository.create({
      user: user,
      possession: 1000000,
    });
    await this.pointsRepository.save(point);
    return user;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'nickname', 'profile', 'name'],
      where: { email: signInDto.email },
    });
    if (_.isNull(user)) {
      throw new UnauthorizedException('이메일을 확인하세요.');
    }
    const comparedPassword = await compare(signInDto.password, user.password);
    if (!comparedPassword) {
      throw new UnauthorizedException('비밀번호를 확인하세요.');
    }
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '7d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async findAll(): Promise<Users[]> {
    const users = await this.usersRepository.find({
      order: {
        id: 'asc',
      },
    });

    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({
      id,
    });
    if (_.isNil(user)) {
      throw new NotFoundException('해당 유저가 없습니다');
    }
    return user;
  }
  /// 포인트 조회
  async getPoint(userId: number) {
    // 사용자의 포인트 합계를 조회
    const { sum } = await this.dataSource
      .getRepository(Point)
      .createQueryBuilder('point')
      .select('SUM(point.possession)', 'sum')
      .where('point.userId = :id', { id: userId })
      .getRawOne();
    console.log(sum);
    // 사용자 정보를 조회
    const user = await this.dataSource
      .getRepository(Users)
      .findOneBy({ id: userId });

    if (!user) {
      throw new Error('유저가 없습니다');
    }

    // 사용자 정보와 포인트 합계를 함께 반환
    return {
      userId: userId,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      point: user.points,
    };
  }

  /// 포인트 조회

  async getPointDetails(userId: number) {
    // 사용자의 포인트 상세 기록을 조회
    const pointDetails = await this.dataSource
      .getRepository(Point)
      .createQueryBuilder('point')
      .where('point.userId = :id', { id: userId })
      .getMany(); // 모든 포인트 기록을 가져옴

    // 사용자 정보를 조회
    const user = await this.dataSource
      .getRepository(Users)
      .findOneBy({ id: userId });

    if (!user) {
      throw new Error('유저가 없습니다');
    }

    return pointDetails;
  }

  async update(id: number, updateDto: UpdateDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    const { nickname, profile, password } = updateDto;

    if (_.isNil(user)) {
      throw new NotFoundException('해당 유저가 없습니다');
    }

    if (!nickname && !profile) {
      throw new BadRequestException('수정할 값을 입력해주세요.');
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
      throw new NotFoundException('해당 유저가 없습니다');
    }

    await this.usersRepository.remove(user);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  //카카오

  async kakaoLogin(
    KAKAO_REST_API_KEY: string,
    KAKAO_REDIRECT_URI: string,
    code: string,
  ) {
    const config = {
      grant_type: 'authorization_code',
      client_id: KAKAO_REST_API_KEY,
      redirect_uri: KAKAO_REDIRECT_URI,
      code,
    };
    const params = new URLSearchParams(config).toString();
    const tokenHeaders = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const tokenUrl = `https://kauth.kakao.com/oauth/token?${params}`;

    const tokenRes = await firstValueFrom(
      this.http.post(tokenUrl, '', { headers: tokenHeaders }),
    );

    // 'any' 타입으로 응답을 단언하여 'access_token'에 접근
    const accessToken = (tokenRes as any).data.access_token;

    // accessToken을 사용하여 사용자 정보를 가져오는 부분
    const userInfoUrl = `https://kapi.kakao.com/v2/user/me`;
    const userInfoHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };

    // 사용자 정보 요청 및 응답 처리
    const userInfoRes = await firstValueFrom(
      this.http.get(userInfoUrl, { headers: userInfoHeaders }),
    );

    const data = userInfoRes.data;
    console.log(1, data);
    // 사용자 정보를 로컬 DB에 저장
    let user = await this.usersRepository.findOne({
      where: { email: data.kakao_account.email },
    });
    if (!user) {
      user = new Users();
      user.email = data.kakao_account.email;
      user.name = data.properties.nickname;
      user.nickname = data.properties.nickname;
      await this.usersRepository.save(user);
    }
    return user;
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,DataSource } from 'typeorm';
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
import { S3FileService } from '../common/utils/s3_fileupload';
//2
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Point)
    private pointsRepository: Repository<Point>,
    private readonly jwtService: JwtService,
    private http: HttpService,
    private readonly s3FileService: S3FileService,
    private dataSource: DataSource,
  ) {}

  async register(signUpDto: SignUpDto, file: Express.Multer.File): Promise<Users> {
    const findEmail = await this.findByEmail(signUpDto.email);
    if (findEmail) {
      throw new ConflictException('이미 가입된 이메일 입니다.');
    }
    const hashedPassword = await hash(signUpDto.password, 10);

    let fileKey = '';
    // 프로필 이미지 s3에 업로드
    if (file) {
      fileKey = await this.s3FileService.uploadFile(file, 'users');
    }

    const user = await this.usersRepository.save({
      email: signUpDto.email,
      password: hashedPassword,
      name: signUpDto.name,
      nickname: signUpDto.nickname,
      profile: fileKey, // s3에 업로드된 파일 키를 사용
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

 
  async update(id: number, updateDto: UpdateDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    const { nickname, profile, password } = updateDto;

    if (_.isNil(user)) {
      throw new NotFoundException('해당 유저가 없습니다');
    }

    if (!nickname && !profile && !password) {
      throw new BadRequestException('수정할 값을 입력해주세요.');
    }

    if (nickname) user.nickname = nickname;
    if (profile) user.profile = profile;
    if (password) user.password = password;

    await this.usersRepository.save(user);

    return user;
  }

  // 자기의 비밀번호에 매칭되야 삭제하기
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
    console.log(userInfoRes);
    // const data = userInfoRes.data;
    // // 사용자 정보를 로컬 DB에 저장
    // let user = await this.usersRepository.findOne({
    //   where: { email: data.email },
    // });
    // if (!user) {
    //   user = new Users();
    //   user.email = data.kakao_account.email;
    //   user.nickname = data.properties.nickname;
    //   // 기타 필요한 정보 추가 가능
    //   await this.usersRepository.save(user);
    // }
    // return user;
  }
}

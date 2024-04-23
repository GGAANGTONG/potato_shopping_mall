// import {
//   BadRequestException,
//   ConflictException,
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository,DataSource } from 'typeorm';
// import { Users } from './entities/user.entitiy';
// import { compare, hash } from 'bcrypt';
// import _ from 'lodash';
// import { SignUpDto } from './dto/signup.dto';
// import { JwtService } from '@nestjs/jwt';
// import { firstValueFrom } from 'rxjs';
// import { HttpService } from '@nestjs/axios';
// import { Point } from '../point/entities/point.entity';
// import { SignInDto } from './dto/sign_in.dto';
// import { UpdateDto } from './dto/update.dto';
// import { S3FileService } from '../common/utils/s3_fileupload';
// import { RedisService } from 'src/redis/redis.service';
// import { Grade } from './type/user_grade.type';

// //2
// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(Users)
//     private usersRepository: Repository<Users>,
//     @InjectRepository(Point)
//     private pointsRepository: Repository<Point>,
//     private readonly jwtService: JwtService,
//     // private http: HttpService,
//     private readonly s3FileService: S3FileService,
//     private dataSource: DataSource,
//      private readonly redisService: RedisService
//   ) {}

//   async register(signUpDto: SignUpDto, file: Express.Multer.File): Promise<Users> {
//     const findEmail = await this.findByEmail(signUpDto.email);
//     if (findEmail) {
//       throw new ConflictException('이미 가입된 이메일 입니다.');
//     }
//     const hashedPassword = await hash(signUpDto.password, 10);

//     let fileKey = '';
//     // 프로필 이미지 s3에 업로드
//     if (file) {
//       fileKey = await this.s3FileService.uploadFile(file, 'users');
//     }

//     const user = await this.usersRepository.save({
//       email: signUpDto.email,
//       password: hashedPassword,
//       name: signUpDto.name,
//       nickname: signUpDto.nickname,
//       profile: fileKey, // s3에 업로드된 파일 키를 사용
//     });

  
//     //포인트 등록

//     const point = this.pointsRepository.create({
//       user: user,
//       possession: 1000000,
//     });
//     await this.pointsRepository.save(point);
//     return user;
//   }

//   async signIn(signInDto: SignInDto) {
//     const user = await this.usersRepository
//       .createQueryBuilder('user')
//       .select(['user.id', 'user.email', 'user.password', 'user.nickname', 'user.profile', 'user.name'])
//       .where('user.email = :email', { email: signInDto.email })
//       .getOne();
  
//     if (!user) {
//       throw new UnauthorizedException('이메일을 확인하세요.');
//     }
  
//     const isPasswordValid = await compare(signInDto.password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('비밀번호를 확인하세요.');
//     }
  
//     const payload = { email: user.email, sub: user.id };
//     const accessToken = this.jwtService.sign(payload, {
//       secret: process.env.JWT_ACCESS_TOKEN_SECRET,
//       expiresIn: '7d',
//     });
  
//     const refreshToken = this.jwtService.sign(payload, {
//       secret: process.env.JWT_REFRESH_TOKEN_SECRET,
//       expiresIn: '7d',
//     });
  
//     await this.redisService.saveRefreshToken(user.id.toString(), refreshToken, 604800); // 7 days in seconds
    
//     return {
//       accessToken,
//       refreshToken,
//     };
//   }
  

//   async findAll(): Promise<Users[]> {
//     const users = await this.usersRepository.find({
//       order: {
//         id: 'asc',
//       },
//     });

//     return users;
//   }

//   async findOne(id: number) {
//     const user = await this.usersRepository.findOneBy({
//       id,
//     });
//     if (_.isNil(user)) {
//       throw new NotFoundException('해당 유저가 없습니다');
//     }
//     return user;
//   }


//   /// 포인트 조회
//   async getPoint(userId: number) {
//     // 사용자의 포인트 합계를 조회
//     const { sum } = await this.dataSource
//       .getRepository(Point)
//       .createQueryBuilder('point')
//       .select('SUM(point.possession)', 'sum')
//       .where('point.userId = :id', { id: userId })
//       .getRawOne();
//     console.log(sum);
//     // 사용자 정보를 조회
//     const user = await this.dataSource
//       .getRepository(Users)
//       .findOneBy({ id: userId });

//     if (!user) {
//       throw new Error('유저가 없습니다');
//     }

//     // 사용자 정보와 포인트 합계를 함께 반환
//     return {
//       userId: userId,
//       email: user.email,
//       name: user.name,
//       nickname: user.nickname,
//       point: user.points,
//     };
//   }

 
//   async update(id: number, updateDto: UpdateDto) {
//     const user = await this.usersRepository.findOne({
//       where: { id },
//     });

//     const { nickname, profile, password } = updateDto;

//     if (_.isNil(user)) {
//       throw new NotFoundException('해당 유저가 없습니다');
//     }

//     if (!nickname && !profile && !password) {
//       throw new BadRequestException('수정할 값을 입력해주세요.');
//     }

//     if (nickname) user.nickname = nickname;
//     if (profile) user.profile = profile;
//     if (password) user.password = password;

//     await this.usersRepository.save(user);

//     return user;
//   }

//   // 자기의 비밀번호에 매칭되야 삭제하기
//   async remove(id: number) {
//     const user = await this.usersRepository.findOneBy({ id });

//     if (_.isNil(user)) {
//       throw new NotFoundException('해당 유저가 없습니다');
//     }

//     await this.usersRepository.remove(user);
//   }

//   async findByEmail(email: string) {
//     const user = await this.usersRepository.findOneBy({ email });
//     return user;
//   }



//   async purchasePoints(userId: number, purchaseAmount: number) {
//     const user = await this.usersRepository.findOneBy({ id: userId });

//     if (!user || user.bank < purchaseAmount) {
//       return { success: false, message: '잔액이 충분하지 않습니다' };
//     }

//     // 계산된 포인트와 사용자의 bank 잔액 업데이트
//     const bonusRate = this.getBonusRate(user.grade);
//     const bonusPoints = purchaseAmount * bonusRate;
//     const totalPoints = purchaseAmount + bonusPoints;
//     user.bank -= purchaseAmount;

//     // 사용자 정보 업데이트
//     await this.usersRepository.save(user);

//     return {
//       success: true,
//       message: '포인트를 성공적으로 구매 햇습니다',
//       newBankBalance: user.bank,
//       totalPoints,
//     };
//   }

//   private getBonusRate(user_grade:Grade): number {
//     switch (user_grade) {
//       case Grade.CUSTUMER:
//         return 0.05;
//       case Grade.THANKFUL:
//         return 0.07;
//       case Grade.VIP:
//         return 0.12;
//       default:
//         return 0;
//     }
//   }

//   signToken(user: Pick<Users, 'email' | 'id'>, isRefreshToken: boolean){
//     const payload = {
//         email: user.email,
//         sub: user.id,
//         type: isRefreshToken ? 'refresh' : 'access',
//     };
//     return this.jwtService.sign(payload, {
//       secret: process.env.JWT_REFRESH_TOKEN_SECRET,
//         expiresIn: isRefreshToken ? 3600: 300,
//     })
// }


//   extractTokenFromHeader(header: string, isBearer: boolean){
//     const splitToken = header.split(' ')
//     const prefix = isBearer ? 'Bearer' : 'Basic';
//     if(splitToken.length !== 2 || splitToken[0] !== prefix){
//         throw new UnauthorizedException('잘못된 토큰입니다.')
//     }
//     const token = splitToken[1];
//     return token;
// }


// rotateToken(token: string, isRefreshToken: boolean){
//   const decoded = this.jwtService.verify(token,{
//     secret: process.env.JWT_REFRESH_TOKEN_SECRET,
//   })

//   return this.signToken({
//       ...decoded,
//   }, isRefreshToken)
// }
// }


import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as _ from 'lodash';
import { Users } from '../user/entities/user.entitiy';


@Injectable()
@Injectable()
  export class UserService {
   constructor(
     @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}


  async validateUser(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async createToken(email: string) {
    const userEmail = await this.findByEmail(email);

    const payload = { sub: userEmail.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: 1000 * 60 * 60 * 12,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: 1000 * 60 * 60 * 24 * 7,
    });


    return { accessToken,refreshToken };
  }


  async createProviderUser(email: string, nickName: string, provider: string) {
    try {
      // Users 엔티티를 저장합니다.
      const userRepository = this.dataSource.getRepository(Users);
      const user = await userRepository.save({});
      
      // OAuthService를 사용하여 외부 서비스에 사용자 정보를 저장합니다.
      const oauthUserInfo = await this.usersRepository.save({
        userId: user.id,
        email: email,
        nickName: nickName,
        provider: provider,
       
      });
  
      // 저장된 사용자 정보를 반환합니다.
      return oauthUserInfo;
    } catch (error) {
      console.error('Failed to create provider user:', error);
      throw error;
    }
  }



     async findByEmail(email: string) {
     const user = await this.usersRepository.findOneBy({ email });
    return user;
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

  
}

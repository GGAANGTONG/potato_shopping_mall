import {
  Injectable,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as _ from 'lodash';
import { UserService } from '../user/users.service';
import { Users } from '../user/entities/user.entitiy';
import { Oauth } from './entities/oauth.entity';


@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(Users)
    private oauthRepository: Repository<Oauth>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}


  async validateUser(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async createToken(email: string) {
    const userEmail = await this.userService.findByEmail(email);

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
      const oauthUserInfo = await this.oauthRepository.save({
        userId: user.id,
        email: email,
        nickName: nickName,
        provider: provider,
        // 추가적으로 필요한 필드
      });
  
      // 저장된 사용자 정보를 반환합니다.
      return oauthUserInfo;
    } catch (error) {
      console.error('Failed to create provider user:', error);
      throw error;
    }
  }
  
}

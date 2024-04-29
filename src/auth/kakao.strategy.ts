import { ExecutionContext, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {Profile, Strategy} from 'passport-kakao'
import { UserService } from '../user/users.service';
import dotenv from 'dotenv'

dotenv.config();

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {

  constructor() {
    super({
      clientID: process.env.KAKAO_REST_API_KEY,
      callbackURL: process.env.KAKAO_REDIRECT_URI_CALLBACK,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      scope: ['account_email', 'profile_nickname']
    })
  };
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // 토큰과 프로파일을 한번 확인해보자
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    console.log(profile);

    return {
      email: profile._json.kakao_account.email,
      nickname: profile.displayName,
    };
  }

}
  // constructor(
  //   private readonly oauthService: OauthService,
  //   private readonly userService: UserService,
  // ) {
  //   super({
  //     clientID: process.env.KAKAO_REST_API_KEY,
  //     callbackURL: process.env.KAKAO_REDIRECT_URI,
  //   });
  // }

  // async validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: Profile,
  //   done: Function,
  // ) {
  //   try {
  //     const email = profile._json && profile._json.kakao_account.email;
  //     const nickName = profile.displayName;
  //     const provider = profile.provider;

  //     let user = await this.oauthService.findByEmailFrom(email);

  //     if (!user) {
  //       user = await this.oauthService.createProviderUser(
  //         email,
  //         nickName,
  //         provider,
          
  //       );
  //     }

  //     const token = await this.oauthService.createToken(email);
  //     const accessToken = token.accessToken;

  //     done(null, { accessToken });
  //   } catch (error) {
  //     console.error('인증 처리 중 오류 발생:', error);
  //     done(error, false);
  //   }
  // }



// // KAKAO_REST_API_KEY = "44cd3c7701cf72f35c8726e3735221c1"
// // KAKAO_CLIENT_SECRET = "sCc6DI8hoAr97zPLvhEMGm10GQQmYi8L"
// // KAKAO_REDIRECT_URI_CODE = "http://localhost:3000/api/oauth/kakao/token"
// // KAKAO_REDIRECT_URI_CALLBACK = "http://localhost:3000/api/oauth/kakao/callback"




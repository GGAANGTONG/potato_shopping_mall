import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { UserService } from '../user/users.service';
import { OauthService } from '../oauth/oauth.service';


@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly oauthService: OauthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.KAKAO_REST_API_KEY,
      callbackURL: process.env.KAKAO_REDIRECT_URI,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    try {
      const email = profile._json && profile._json.kakao_account.email;
      const nickName = profile.displayName;
      const provider = profile.provider;

      let user = await this.oauthService.findByEmailFrom(email);

      if (!user) {
        user = await this.oauthService.createProviderUser(
          email,
          nickName,
          provider,
          
        );
      }

      const token = await this.oauthService.createToken(email);
      const accessToken = token.accessToken;

      done(null, { accessToken });
    } catch (error) {
      console.error('인증 처리 중 오류 발생:', error);
      done(error, false);
    }
  }
}
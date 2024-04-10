import { Controller, Get, Header, Res, HttpStatus, Query } from '@nestjs/common';
import { OauthService } from './oauth.service';


@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  
  @Get('')
  @Header('Content-Type', 'text/html')
  redirectToKakaoAuth(@Res() res) {
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;

    res.redirect(HttpStatus.TEMPORARY_REDIRECT, kakaoAuthURL);
  }

  @Get('callback')
  async getKakaoInfo(@Query() query: { code }) {
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

    await this.oauthService.kakaoLogin(
      KAKAO_REST_API_KEY,
      KAKAO_REDIRECT_URI,
      query.code,
    );
    return { message: '로그인 되었습니다' };
  }
}

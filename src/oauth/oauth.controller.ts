import { Controller, Get, Header, Res, HttpStatus, Query, Req } from '@nestjs/common';
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

  @Get('kakao/callback')
  async kakaoCallbacks(@Req() req, @Res() res) {
    const accessToken = req.user.accessToken;

    res.cookie('authorization', `Bearer ${accessToken}`, {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: true,
      secure: true,
    });
    res.redirect('/');
  }
}

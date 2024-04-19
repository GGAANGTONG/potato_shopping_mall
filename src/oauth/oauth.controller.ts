import { Controller, Get, Header, Res, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { KakaoAuthGuard } from 'src/auth/kakao.guard';
import { SocialUser, SocialUserAfterAuth } from 'src/user/decorator/user.decorator';
import { JwtService } from '@nestjs/jwt';


@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly jwtService: JwtService,
  ) {}

  
@UseGuards(KakaoAuthGuard)
@Get('kakao/callback')
async kakaoCallbacks (
  @SocialUser() socialUser: SocialUserAfterAuth,
  @Res({passthrough: true}) res
): Promise<void> {

  const {email, password, nickname} = socialUser
  const user = await this.oauthService.findByEmailFrom(email)
  // if(!user) {
  //   user = await this.oauthService.createUser({
  //     createUserDto: CreateUserDto
  //   })
  // }
  const payload = {sub:user.id}
  const accessToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: 1000 * 60 * 60 * 12,
  });

  const refreshToken = this.jwtService.sign(payload, {
    secret: process.env.REFRESH_SECRET,
    expiresIn: 1000 * 60 * 60 * 24 * 7,
  });

  // refreshToken은 레디스에 넣어서 보관
  // await this.redisService.getClient().set(`refreshToken for ${user.id}`, refreshToken)
  
  console.log('위대한 국밥', refreshToken)
  console.log('완벽한 국밥', accessToken)
  res.cookie('accessToken', accessToken)
  return res.redirect('/health-check')
}
  // @Get('')
  // @Header('Content-Type', 'text/html')
  // redirectToKakaoAuth(@Res() res) {
  //   const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  //   const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
  //   const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;

  //   res.redirect(HttpStatus.TEMPORARY_REDIRECT, kakaoAuthURL);
  // }

  // @Get('kakao/callback')
  // async kakaoCallbacks(@Req() req, @Res() res) {
  //   const accessToken = req.user.accessToken;

  //   res.cookie('authorization', `Bearer ${accessToken}`, {
  //     maxAge: 1000 * 60 * 60 * 12,
  //     httpOnly: true,
  //     secure: true,
  //   });
  //   res.redirect('/');
  // }
  



}

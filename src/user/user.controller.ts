// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Header,
//   HttpStatus,
//   Param,
//   Patch,
//   Post,
//   Headers,
//   Req,
//   Res,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { UserService } from './users.service';
// import { SignUpDto } from './dto/signup.dto';
// import { SignInDto } from './dto/sign_in.dto';
// import { Users } from './entities/user.entitiy';
// import { UpdateDto } from './dto/update.dto';
// import { AuthGuard } from '@nestjs/passport';
// import { ResizeImagePipe } from '../common/pipe/resize-image.pipe';
// import { FileInterceptor } from '@nestjs/platform-express';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   // 리턴 추가하기 //추가함
//   @Post('register')

//   @UseInterceptors(FileInterceptor('file'))
//   async register(
//     @UploadedFile(new ResizeImagePipe(400, 400)) file: Express.Multer.File,
//     @Body() signUpDto: SignUpDto,
//     @Res() res,
//   ) {
//     await this.userService.register(signUpDto, file);
//     return res.send('회원가입되었습니다. 로그인해주세요!');

//   } //1

//   // refresh토큰이 저장 되는곳이 없다 레디스에 저장하면 어떨까?
//   @Post('login')
//   async signIn(@Body() signInDto: SignInDto ,@Res() res) {
//     const user = await this.userService.signIn(signInDto);
//     res.cookie('authorization', `Bearer ${user.accessToken}`);
//     return res.status(HttpStatus.OK).json({
//       message: '로그인 완료 ',
//       user,
//     });
//   }

//   @Get('list')
//   async findAll() {
//     return await this.userService.findAll();
//   }

//   @Get('info/:id')
//   async findOne(@Param('id') id: number): Promise<Users> {
//     return await this.userService.findOne(id);
//   }

//   @Patch('update/:id')
//   async update(@Param('id') id: number, @Body() updateDto: UpdateDto) {
//     await this.userService.update(+id, updateDto);
//     return { message: '수정되었습니다' };
//   }

//   @Delete('delete/:id')
//   async remove(@Param('id') id: number) {
//     await this.userService.remove(id);
//     return { message: '삭제 되었습니다' };
//   }


//   // 3단계때 리펙토링
//   //포인트 조회
//   @UseGuards(AuthGuard('jwt'))
//   @Get('point')
//   async getPoint(@Req() req) {
//     const user = req.user;
//     const point = await this.userService.getPoint(user.id);
//     return point;
//   }

//   @Post('/purchase/:userId')
//   async purchasePoints(
//     @Param('userId') userId: number,
//     @Body('purchaseAmount') purchaseAmount: number,) {
//     return await this.userService.purchasePoints(userId, purchaseAmount);
//   }


//   @Post('token/refresh')
//   postTokenRefresh(@Headers('authorization') rawToken: string){
//     const token = this.userService.extractTokenFromHeader(rawToken, true);
//     const newToken = this.userService.rotateToken(token, false);
//     return {
//       accessToken: newToken,
//     }
//   }





  // @Get('/oauth')
  // @Header('Content-Type', 'text/html')
  // redirectToKakaoAuth(@Res() res) {
  //   const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  //   const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
  //   const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;

  //   res.redirect(HttpStatus.TEMPORARY_REDIRECT, kakaoAuthURL);
  // }

  // @Get('/oauth/callback')
  // async getKakaoInfo(@Query() query: { code }) {
  //   const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  //   const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

  //   await this.userService.kakaoLogin(
  //     KAKAO_REST_API_KEY,
  //     KAKAO_REDIRECT_URI,
  //     query.code,
  //   );
  //   return { message: '로그인 되었습니다' };
  // }
// }
import { Controller, Get, Header, Res, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';

import { KakaoAuthGuard } from 'src/auth/kakao.guard';
import { SocialUser, SocialUserAfterAuth } from 'src/user/decorator/user.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users.service';


@Controller('oauth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  

@UseGuards(KakaoAuthGuard)
@Get('kakao/callback')
async kakaoCallbacks (
  @SocialUser() socialUser: SocialUserAfterAuth,
  @Res({passthrough: true}) res
): Promise<void> {

  const {email, password, nickname} = socialUser
  const user = await this.userService.findByEmail(email)
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

}



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

// }
import {
  Controller,
  Get,
  Headers,
  Res,
  HttpStatus,
  Query,
  Req,
  UseGuards,
  Patch,
  Body,
  Delete,
  Param,
  Post,
} from '@nestjs/common';

import { KakaoAuthGuard } from 'src/auth/kakao.guard';
import {
  SocialUser,
  SocialUserAfterAuth,
} from 'src/user/decorator/user.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users.service';
import { RedisService } from 'src/redis/redis.service';
import _ from 'lodash';
import { UpdateDto } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('oauth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  // 로그인 & 회원가입//
  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  async kakaoCallbacks(
    @SocialUser() socialUser: SocialUserAfterAuth,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    const { email, nickName } = socialUser;
    console.log(socialUser);
    const user = await this.userService.findByEmail(email);
    console.log(user);

    if (_.isNil(user)) {
      const user = await this.userService.createUser(email, nickName);

      const payload = { sub: user.id };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: 1000 * 60 * 60 * 36,
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_SECRET,
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      });

      await this.redisService
        .getClient()
        .set(`refreshToken for ${user.id}`, refreshToken);
      console.log('토큰 발급', accessToken);

      res.cookie('accessToken', `Bearer ${accessToken}`);
      return res.redirect('http://localhost:3000/');
    }

    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 1000 * 60 * 60 * 12,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 1000 * 60 * 60 * 24 * 7,
    });

    await this.redisService
      .getClient()
      .set(`refreshToken for ${user.id}`, refreshToken);
    res.cookie('accessToken', `Bearer ${accessToken}`);
    console.log('카카오 로그인', accessToken);
    console.log('도메인: ' + process.env.CLIENT_HOST);
    return res.redirect(301, `http://${process.env.CLIENT_HOST}`);
  }

  //회원정보 수정(으아아아아아아)
  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateDto) {
    const data = await this.userService.update(+id, updateDto);
    return { message: '수정되었습니다', data };
  }

  //회원정보 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  async remove(@Param('id') id: number) {
    const data = await this.userService.remove(id);
    return {
      message: '삭제 되었습니다',
      data,
    };
  }

  //회원정보 찾기
  @UseGuards(AuthGuard('jwt'))
  @Get('find-one')
  async findOne(@Req() req) {
    const id = req.user.id;
    const data = await this.userService.findOne(id);
    return {
      message: '회원정보입니다.',
      data,
    };
  }

  //토큰 갱신
  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string, @Res() res) {
    const token = this.userService.extractTokenFromHeader(rawToken, true);
    const newAccessToken = this.userService.rotateToken(token);

    res.cookie('accessToken', `${newAccessToken}`);

    return {
      message: '토큰이 재발급 되었습니다.',
      accessToken: newAccessToken,
    };
  }
}

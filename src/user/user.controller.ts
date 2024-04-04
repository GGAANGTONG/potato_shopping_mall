import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/sign_in.dto';
import { Users } from './entities/user.entitiy';
import { UpdateDto } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResizeImagePipe } from '../common/pipe/resize-image.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  async register(
    @UploadedFile(new ResizeImagePipe(400, 400)) file: Express.Multer.File,
    @Body() signUpDto: SignUpDto,
    @Res() res,
  ) {
    await this.userService.register(signUpDto, file);
    res.send('회원가입되었습니다. 로그인해주세요!');
  } //1

  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res) {
    const user = await this.userService.signIn(signInDto);
    res.cookie('authorization', `Bearer ${user.accessToken}`);
    return res.status(HttpStatus.OK).json({
      message: '로그인 완료 ',
      user,
    });
  }

  @Get('list')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('info/:id')
  async findOne(@Param('id') id: number): Promise<Users> {
    return await this.userService.findOne(id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateDto) {
    await this.userService.update(+id, updateDto);
    return { message: '수정되었습니다' };
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number) {
    await this.userService.remove(id);
    return { message: '삭제 되었습니다' };
  }

  //포인트 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('point')
  async getPoint(@Req() req) {
    const user = req.user;
    const point = await this.userService.getPoint(user.id);
    return point;
  }

  @Get('point/:userId')
  async getPointDetails(@Param('userId') userId: number): Promise<any> {
    const details = await this.userService.getPointDetails(userId);
    return details;
  }

  @Get('/oauth')
  @Header('Content-Type', 'text/html')
  redirectToKakaoAuth(@Res() res) {
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;

    res.redirect(HttpStatus.TEMPORARY_REDIRECT, kakaoAuthURL);
  }

  @Get('/oauth/callback')
  async getKakaoInfo(@Query() query: { code }) {
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

    await this.userService.kakaoLogin(
      KAKAO_REST_API_KEY,
      KAKAO_REDIRECT_URI,
      query.code,
    );
    return { message: '로그인 되었습니다' };
  }
}

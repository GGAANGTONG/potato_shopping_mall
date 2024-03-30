import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { UserService } from "./users.service";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/sign_in.dto";
import { Users } from "./entities/user.entitiy";
import { UpdateDto } from "./dto/update.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  async register(@Body() signUpDto: SignUpDto, @Res() res) {
    await this.userService.register(signUpDto);
    res.send("회원가입되었습니다. 로그인해주세요!");
  }

  @Post("login")
  async signIn(@Body() signInDto: SignInDto, @Res() res) {
    const user = await this.userService.signIn(signInDto);
    res.cookie("authorization", `Bearer ${user.accessToken}`);
    return res.status(HttpStatus.OK).json({
      message: "로그인 완료 ",
      user,
    });
  }

  @Get("list")
  async findAll() {
    return await this.userService.findAll();
  }

  @Get("info/:id")
  async findOne(@Param("id") id: number): Promise<Users> {
    return await this.userService.findOne(id);
  }

  @Patch("update/:id")
  async update(@Param("id") id: number, @Body() updateDto: UpdateDto) {
    await this.userService.update(+id, updateDto);
    return { message: "수정되었습니다" };
  }

  @Delete("delete/:id")
  async remove(@Param("id") id: number) {
    await this.userService.remove(id);
    return { message: "삭제 되었습니다" };
  }
}

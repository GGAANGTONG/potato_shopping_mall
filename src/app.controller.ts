import { Controller, Get } from "@nestjs/common";

//CD 서버에 지속적인 응답(생존 신호)을 보내기 위함
@Controller("health-check")
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return "Hello World!";
  }
}

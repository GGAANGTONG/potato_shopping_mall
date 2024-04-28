import { Controller, Post, Body,Get, Res, HttpException } from '@nestjs/common';
import { TossService } from './toss.service';
import { join } from 'path';

@Controller()
export class TossController {
  constructor(private readonly tossService: TossService) {}

  @Post('/confirm')
  async confirmPayment(@Body() body: { paymentKey: string, orderId: string, amount: number }) {
    try {
      const response = await this.tossService.confirmPayment(body);
      return response.data; // NestJS will automatically handle 200 OK status.
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  @Get('/success')
  sendSuccessPage(@Res() res: Response) {
    return { url: join(process.cwd(), 'public/success.html') };
  }

  @Get('/fail')
  sendFailPage(@Res() res: Response) {
    return { url: join(process.cwd(), 'public/fail.html') };
  }
}
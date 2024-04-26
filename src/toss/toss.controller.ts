import { Controller, Post, Body,Get, Res, HttpException, Render } from '@nestjs/common';
import { TossService } from './toss.service';
import { join } from 'path';

@Controller()
export class TossController {
  constructor(private readonly tossService: TossService) {}

  @Post('confirm')
  async confirmPayment(@Body() body: { paymentKey: string, orderId: string, amount: number }) {
    try {
      const response = await this.tossService.confirmPayment(body);
      return response.data; // NestJS will automatically handle 200 OK status.
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  @Get('success')
  sendSuccessPage(@Res() res) {
    console.log('토스 국밥')
    console.log('토스 국밥-1', process.cwd())
    console.log('토스 국밥-2',join(process.cwd(), 'src/toss/success.html'))

    //결제 정보를 생성하고, 이 정보를 payments table에 등록하는 로직
    

    return res.redirect(join(process.cwd(), 'src/toss/success.html'));
  }

  // @Get('success')
  // @Render('success')
  // sendSuccessPage() {

  //   return {title: 'Success Page'}
  // }

  @Get('fail')
  sendFailPage(@Res() res: Response) {
    return { url: join(process.cwd(), 'fail.html') };
  }
}
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { Status } from './types/order.type';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }


  //상품 주문 및 결제
  @UseGuards(AuthGuard('jwt'))
  @Post()
  purchase(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    return this.ordersService.purchase(userId, createOrderDto);
  }

  // 유저 주문 목록 전체 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async findAllOrderByUser(@Req() req) {
    const userId = req.user.id; // 현재 로그인한 사용자의 ID
    return this.ordersService.findAllOrderbyUser(userId);
  }

  // 주문 정보 전체 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  async findAllOrderByAdmin() {
    return this.ordersService.findAllOrderbyAdmin();
  }

  // 주문 정보 상세 조회
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOneOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOneOrderbyBoth(id);
  }

  // 주문 취소
  @UseGuards(AuthGuard('jwt'))
  @Post(':orderId/cancel')
  async cancelOrder(@Param('orderId') orderId: number) {
    try {
      // 주문 취소 로직을 서비스에서 호출하여 실행합니다.
      const cancelledOrder = await this.ordersService.cancelOrder(orderId);
      return { message: '주문이 취소되었습니다.', order: cancelledOrder };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException('주문을 취소할 수 없습니다.'); // 그 외의 오류는 일반적인 오류 메시지를 반환합니다.
      }
    }
  }
}

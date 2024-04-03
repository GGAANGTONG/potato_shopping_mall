import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  purchase(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    return this.ordersService.purchase(userId, createOrderDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async findAllOrderByUser(@Req() req) {
    const userId = req.user.id; // 현재 로그인한 사용자의 ID
    return this.ordersService.findAllOrderbyUser(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  async findAllOrderByAdmin() {
    return this.ordersService.findAllOrderbyAdmin();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOneOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOneOrderbyBoth(id);
  }
}
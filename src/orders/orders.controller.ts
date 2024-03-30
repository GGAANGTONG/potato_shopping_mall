import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  purchase(@Body() userId: number, createOrderDto: CreateOrderDto) {
    return this.ordersService.purchase(userId, createOrderDto);
  }

}

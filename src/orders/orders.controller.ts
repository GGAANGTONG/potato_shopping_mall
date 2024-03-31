import { Body, Controller, Post, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  purchase(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id
    return this.ordersService.purchase(userId, createOrderDto);
  }

}

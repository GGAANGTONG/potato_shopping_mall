import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './carts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add/:goodsId')
  async addToCart(
    @Req() req,
    @Param('goodsId', ParseIntPipe) goodsId: number,
    @Body() createOrderDto: CreateCartDto,
  ) {
    const userId = req.user.id; // 로그인한 사용자의 ID
    return this.cartService.addToCart(userId, goodsId, createOrderDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:cartId')
  async removeFromCart(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartService.removeFromCart(cartId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:cartId')
  async updateQuantity(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Body('count', ParseIntPipe) count: number,
  ) {
    return this.cartService.updateQuantity(cartId, count);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getCartItems(@Req() req) {
    const userId = req.user.id; // 로그인한 사용자의 ID
    return this.cartService.getCartItems(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('clear')
  async clearCart(@Req() req) {
    const userId = req.user.id; // 로그인한 사용자의 ID
    return this.cartService.clearCart(userId);
  }
}

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
    @Body() createCartDto: CreateCartDto,
  ) {
    const userId = req.user.id; // 로그인한 사용자의 ID
    return this.cartService.addToCart(userId, goodsId, createCartDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:cartId')
  async removeFromCart(@Req() req, @Param('cartId', ParseIntPipe) cartId: number) {
    const userId = req.user.id
    return this.cartService.removeFromCart(userId, cartId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:cartId')
  async updateQuantity(
    @Req() req,
    @Param('cartId', ParseIntPipe) cartId: number,
    @Body('count', ParseIntPipe) count: number,
  ) {
    const userId = req.user.id
    return this.cartService.updateQuantity(userId, cartId, count);
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

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
import logger from 'src/common/log/logger';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add/:goodsId')
  addToCart(
    @Req() req,
    @Param('goodsId', ParseIntPipe) goodsId: number,
    @Body() createCartDto: CreateCartDto,
  ) {
    const userId = req.user.id; // 로그인한 사용자의 ID
    logger.traceLogger(`Cart - addToCart`, `req.user = ${JSON.stringify(req.user)}, goodsId = ${goodsId}, createCartDto = ${createCartDto}`)
    return this.cartService.addToCart(userId, goodsId, createCartDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:cartId')
  removeFromCart(@Req() req, @Param('cartId', ParseIntPipe) cartId: number) {
    const userId = req.user.id
    logger.traceLogger(`Cart - removeFromCart`, `req.user = ${JSON.stringify(req.user)}, cartId = ${cartId}`)
    return this.cartService.removeFromCart(userId, cartId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:cartId')
  updateQuantity(
    @Req() req,
    @Param('cartId', ParseIntPipe) cartId: number,
    @Body('count', ParseIntPipe) count: number,
  ) {
    const userId = req.user.id
    logger.traceLogger(`Cart - `, `req.user = ${JSON.stringify(req.user)}, cartId = ${cartId}, count = ${count}`)
    return this.cartService.updateQuantity(userId, cartId, count);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getCartItems(@Req() req) {
    const userId = req.user.id; // 로그인한 사용자의 ID
    logger.traceLogger(`Cart - `, `req.user = ${JSON.stringify(req.user)}`)
    return this.cartService.getCartItems(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('clear')
  clearCart(@Req() req) {
    const userId = req.user.id; // 로그인한 사용자의 ID
    logger.traceLogger(`Cart - `, `req.user = ${JSON.stringify(req.user)}`)
    return this.cartService.clearCart(userId);
  }
}

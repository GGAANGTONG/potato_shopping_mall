import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':orders_id')
  async createReview(
    @Param('orders_id') orderId: number,
    @Body() body: { stars: string; review: string },
  ) {
    return await this.reviewService.createReview(
      orderId,
      body.stars,
      body.review,
    );
  }

  @Get(':orders_id')
  async getReviewByOrderId(@Param('orders_id') orderId: number) {
    return await this.reviewService.getReviewByOrderId(orderId);
  }

  @Patch(':orders_id')
  async updateReviewByOrderId(
    @Param('orders_id') orderId: number,
    @Body() body: { stars: string; review: string },
  ) {
    return await this.reviewService.updateReviewByOrderId(
      orderId,
      body.stars,
      body.review,
    );
  }

  @Delete(':orders_id')
  async deleteReviewByOrderId(@Param('orders_id') orderId: number) {
    return await this.reviewService.deleteReviewByOrderId(orderId);
  }
}

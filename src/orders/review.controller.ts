import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':ordersId')
  async createReview(
    @Param('ordersId') ordersId: number,
    @Body() body: { stars: string; review: string },
  ) {
    return await this.reviewService.createReview(
      ordersId,
      body.stars,
      body.review,
    );
  }

  @Get(':ordersId')
  async getReviewByOrderId(@Param('ordersId') ordersId: number) {
    return await this.reviewService.getReviewByOrderId(ordersId);
  }

  @Patch(':ordersId')
  async updateReviewByOrderId(
    @Param('ordersId') ordersId: number,
    @Body() body: { stars: string; review: string },
  ) {
    return await this.reviewService.updateReviewByOrderId(
      ordersId,
      body.stars,
      body.review,
    );
  }

  @Delete(':ordersId')
  async deleteReviewByOrderId(@Param('ordersId') ordersId: number) {
    return await this.reviewService.deleteReviewByOrderId(ordersId);
  }
}

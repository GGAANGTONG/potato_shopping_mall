import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  //리뷰 작성
  @UseGuards(AuthGuard('jwt'))
  @Post(':ordersDetailsId')
  async createReview(
    @Param('ordersDetailsId') orderdetailsId: number,
    @Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.createReview(orderdetailsId, createReviewDto
    );
  }

  //작성한 리뷰 조회
  @UseGuards(AuthGuard('jwt'))
  @Get(':ordersDetailsId')
  async getReviewByOrderDetailsId(@Param('ordersDetailsId') ordersDetailsId: number) {
    return await this.reviewService.getReviewByOrderDetailsId(ordersDetailsId);
  }

  //리뷰 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch(':ordersDetailsId')
  async updateReviewByOrderDetailsId(
    @Param('ordersDetailsId') ordersDetailsId: number,
    @Body() body: { stars: string; review: string },
  ) {
    return await this.reviewService.updateReviewByOrderDetailsId(
      ordersDetailsId,
      body.stars,
      body.review,
    );
  }

  //리뷰 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete(':ordersDetailsId')
  async deleteReviewByOrderDetailsId(@Param('ordersDetailsId') ordersDetailsId: number) {
    return await this.reviewService.deleteReviewByOrderDetailsId(ordersDetailsId);
  }
}

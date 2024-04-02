import { Repository } from 'typeorm';
import { Reviews } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class ReviewService {
  constructor(
    @InjectRepository(Reviews)
    private reviewRepository: Repository<Reviews>,
  ) {}

  /**
   * 리뷰 작성
   * @param stars
   * @param ordersId
   * @param review
   * @returns
   */
  async createReview(
    ordersId: number,
    stars: string,
    review: string,
  ): Promise<Reviews> {
    const newReview = await this.reviewRepository.create({
      orders_id: ordersId,
      stars,
      review,
    });
    return await this.reviewRepository.save(newReview);
  }

  /**
   * 작성한 리뷰 조회
   * @param ordersId
   * @returns
   */
  async getReviewByOrderId(ordersId: number): Promise<Reviews | undefined> {
    return await this.reviewRepository.findOne({
      where: { orders_id: ordersId },
    });
  }

  /**
   * 리뷰 수정
   * @param stars
   * @param ordersId
   * @param review
   * @returns
   */
  async updateReviewByOrderId(
    ordersId: number,
    stars: string,
    review: string,
  ): Promise<Reviews | undefined> {
    const existingReview = await this.getReviewByOrderId(ordersId);
    if (existingReview) {
      existingReview.stars = stars;
      existingReview.review = review;
      return await this.reviewRepository.save(existingReview);
    }
    return undefined;
  }

  async deleteReviewByOrderId(ordersId: number): Promise<boolean> {
    const deleteResult = await this.reviewRepository.delete({
      orders_id: ordersId,
    });
    return deleteResult.affected !== 0;
  }
}

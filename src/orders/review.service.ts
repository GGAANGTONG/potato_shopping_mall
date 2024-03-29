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
   * @param orders_id
   * @param review
   * @returns
   */
  async createReview(
    orders_id: number,
    stars: string,
    review: string,
  ): Promise<Reviews> {
    const newReview = await this.reviewRepository.create({
      orders_id,
      stars,
      review,
    });
    console.log(newReview);
    return await this.reviewRepository.save(newReview);
  }

  /**
   * 작성한 리뷰 조회
   * @param orders_id
   * @returns
   */
  async getReviewByOrderId(orders_id: number): Promise<Reviews | undefined> {
    return await this.reviewRepository.findOne({ where: { orders_id } });
  }

  /**
   * 리뷰 수정
   * @param stars
   * @param orders_id
   * @param review
   * @returns
   */
  async updateReviewByOrderId(
    orders_id: number,
    stars: string,
    review: string,
  ): Promise<Reviews | undefined> {
    const existingReview = await this.getReviewByOrderId(orders_id);
    if (existingReview) {
      existingReview.stars = stars;
      existingReview.review = review;
      return await this.reviewRepository.save(existingReview);
    }
    return undefined;
  }

  async deleteReviewByOrderId(orders_id: number): Promise<boolean> {
    const deleteResult = await this.reviewRepository.delete({ orders_id });
    return deleteResult.affected !== 0;
  }
}

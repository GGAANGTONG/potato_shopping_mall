import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reviews } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Reviews)
    private reviewRepository: Repository<Reviews>,
  ) { }

  /**
   * 리뷰 작성
   * @param ordersId
   * @param stars
   * @param review
   * @returns
   */
  async createReview(
    ordersId: number,
    stars: string,
    review: string,
  ): Promise<Reviews> {
    try {
      const newReview = this.reviewRepository.create({
        orders_id: ordersId,
        stars,
        review,
      });
      return await this.reviewRepository.save(newReview);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * 작성한 리뷰 조회
   * @param ordersId
   * @returns
   */
  async getReviewByOrderId(ordersId: number): Promise<Reviews | undefined> {
    try {
      const review = await this.reviewRepository.findOne({
        where: { orders_id: ordersId },
      });
      if (!review) {
        throw new NotFoundException('해당 주문에 대한 리뷰를 찾을 수 없습니다.');
      }
      return review;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * 리뷰 수정
   * @param ordersId
   * @param stars
   * @param review
   * @returns
   */
  async updateReviewByOrderId(
    ordersId: number,
    stars: string,
    review: string,
  ): Promise<Reviews | undefined> {
    try {
      const existingReview = await this.getReviewByOrderId(ordersId);
      if (existingReview) {
        existingReview.stars = stars;
        existingReview.review = review;
        return await this.reviewRepository.save(existingReview);
      }
      return undefined;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * 리뷰 삭제
   * @param ordersId
   * @returns
   */
  async deleteReviewByOrderId(ordersId: number): Promise<boolean> {
    try {
      const deleteResult = await this.reviewRepository.delete({
        orders_id: ordersId,
      });
      return deleteResult.affected !== 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

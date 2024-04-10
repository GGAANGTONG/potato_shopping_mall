import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Reviews } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersDetails } from '../orders/entities/ordersdetails.entity'; // OrdersDetails 엔티티 추가
import { Status } from './types/order.type';
import { Orders } from './entities/orders.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Reviews)
    private reviewRepository: Repository<Reviews>,
    @InjectRepository(OrdersDetails)
    private ordersdetailsRepository: Repository<OrdersDetails>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    private readonly dataSource: DataSource,

  ) { }

  async createReview(

    orderdetailsId: number,
    createReviewDto: CreateReviewDto,
  ) {

    const OrderRunner = this.dataSource.createQueryRunner();
    await OrderRunner.connect();
    await OrderRunner.startTransaction();
    try {
      const orderDetails = await OrderRunner.manager.getRepository(OrdersDetails).findOne(
        {
          where:
          {
            id: orderdetailsId,
          },
        });
      if (!orderDetails) {
        throw new NotFoundException('주문 상세 정보를 찾을 수 없습니다.');
      }

      const { review, stars } = createReviewDto
      const order = await OrderRunner.manager.findOne(Orders, {
        where: {
          id: orderDetails.orders_id
        },
      })

      if (order.o_status !== Status.Deliverydone) {
        throw new BadRequestException('배송 완료된 주문에만 리뷰를 작성할 수 있습니다.');
      }

      const newReview = await OrderRunner.manager.getRepository(Reviews).save({
        ordersdetails_id: orderdetailsId,
        stars,
        review,
      });

      await OrderRunner.commitTransaction();


      return newReview
    } catch (err) {
      await OrderRunner.rollbackTransaction();

      console.error(err);
      throw err;

    } finally { await OrderRunner.release(); }
  }

  /**
   * 작성한 리뷰 조회
   * @param ordersdetailsId
   * @returns
   */
  async getReviewByOrderDetailsId(ordersdetailsId: number): Promise<Reviews | undefined> {
    try {
      if (!ordersdetailsId || ordersdetailsId <= 0) {
        throw new BadRequestException('유효하지 않은 주문 상세 아이디입니다.');
      }

      const review = await this.reviewRepository.findOne({
        where: { ordersdetails_id: ordersdetailsId },
      });

      if (!review) {
        throw new NotFoundException('해당 주문 상세에 대한 리뷰를 찾을 수 없습니다.');
      }

      return review;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * 리뷰 수정
   * @param ordersdetailsId
   * @param stars
   * @param review
   * @returns
   */
  async updateReviewByOrderDetailsId(
    ordersdetailsId: number,
    stars: string,
    review: string,
  ): Promise<Reviews | undefined> {
    try {
      if (!ordersdetailsId || ordersdetailsId <= 0) {
        throw new BadRequestException('유효하지 않은 주문 상세 아이디입니다.');
      }

      const existingReview = await this.getReviewByOrderDetailsId(ordersdetailsId);
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
   * @param ordersdetailsId
   * @returns
   */
  async deleteReviewByOrderDetailsId(ordersdetailsId: number): Promise<boolean> {
    try {
      if (!ordersdetailsId || ordersdetailsId <= 0) {
        throw new BadRequestException('유효하지 않은 주문 상세 아이디입니다.');
      }

      const deleteResult = await this.reviewRepository.delete({
        ordersdetails_id: ordersdetailsId,
      });
      return deleteResult.affected !== 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

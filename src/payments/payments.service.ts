import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from './entities/payments.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payments)
    private paymentsRepository: Repository<Payments>,
  ) { }

  // 유저별 결제 목록 전체 조회
  async findAllOrderbyUser(userId: number): Promise<Payments[]> {
    try {
      const payments = await this.paymentsRepository.find({ where: { user_id: userId } });
      if (!payments || payments.length === 0) {
        throw new NotFoundException('결제 정보가 없습니다.');
      }
      return payments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 전체 결제 정보 확인
  async findAllOrderbyAdmin(): Promise<Payments[]> {
    try {
      const payments = await this.paymentsRepository.find();
      if (!payments || payments.length === 0) {
        throw new NotFoundException('결제 정보가 없습니다.');
      }
      return payments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 상세 결제 정보 확인
  async findOneOrderbyBoth(paymentsId: number): Promise<Payments> {
    try {
      const payments = await this.paymentsRepository.findOne({ where: { id: paymentsId } });
      if (!payments) {
        throw new NotFoundException('결제 정보가 없습니다.');
      }
      return payments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

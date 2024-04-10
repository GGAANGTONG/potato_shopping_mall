import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from './entities/payments.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Point } from '../point/entities/point.entity';
import { Users } from '../user/entities/user.entitiy';
import { PayStatus } from './types/payments.type';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payments)
    private paymentsRepository: Repository<Payments>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) { }

  // 유저별 결제 목록 전체 조회
  async findAllOrderbyUser(userId: number): Promise<Payments[]> {
    try {
      // null,undefined,0 들어올 경우 대비 로직 추가 //완료
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

  // 결제 취소
  async cancelPay(userId: number, paymentsId: number): Promise<Payments> {
    const payments = await this.paymentsRepository.findOne({
      where: { id: paymentsId, user_id: userId }
    });
    if (!payments) {
      throw new NotFoundException('결제 정보를 찾을 수 없습니다.');
    }

    // 환불 로직
    if (payments.p_status !== '결제취소') {
      const refundAmount = payments.p_total_price; // 결제 취소로 인한 환불액
      const userPoint = await this.pointRepository.findOne({ where: { userId: payments.user_id } });
      if (!userPoint) {
        throw new NotFoundException('사용자 포인트를 찾을 수 없습니다.');//포인트 테이블에 해당 유저 데이터가 없는 경우
      }

      //트랜잭션 필요
      userPoint.possession += refundAmount; // 포인트 테이블에 환불액 기록
      await this.pointRepository.save(userPoint);

      const user = await this.usersRepository.findOne({ where: { id: payments.user_id } });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      user.points += refundAmount; // 유저의 기존 포인트에 환불액 추가
      await this.usersRepository.save(user);
    }

    payments.p_status = PayStatus.Paycancel; // 결제 상태를 '결제취소'로 변경
    return this.paymentsRepository.save(payments);
  }
}

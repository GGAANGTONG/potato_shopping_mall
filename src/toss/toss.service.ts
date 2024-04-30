import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Buffer } from 'buffer';
import { TossHistory } from 'src/payments/entities/tossHistory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TossService {
  constructor(
    @InjectRepository(TossHistory) private readonly tossRepository:Repository<TossHistory>
  ) {}
  private readonly secretKey = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';
  private readonly baseUrl = 'https://api.tosspayments.com/v1/payments/confirm';

  async confirmPayment({ paymentKey, orderId, amount }): Promise<any> {
    const encryptedSecretKey = 'Basic ' + Buffer.from(this.secretKey + ':').toString('base64');
    const data = await this.tossRepository.findOneBy({toss_orders_id:orderId})
    if(data.p_status == true) {
      throw new BadRequestException('이미 결제된 내역입니다.')
    }
    
    return axios.post(this.baseUrl, {
      orderId: orderId,
      amount: amount,
      paymentKey: paymentKey,
    }, {
      headers: {
        Authorization: encryptedSecretKey,
        'Content-Type': 'application/json',
      }
    });
  }
}
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Buffer } from 'buffer';

@Injectable()
export class TossService {
  private readonly secretKey = 'test_sk_kYG57Eba3G2JA0YzDoyk8pWDOxmA';
  private readonly baseUrl = 'https://api.tosspayments.com/v1/payments/confirm';

  async confirmPayment({ paymentKey, orderId, amount }): Promise<any> {
    const encryptedSecretKey = 'Basic ' + Buffer.from(this.secretKey + ':').toString('base64');
    
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
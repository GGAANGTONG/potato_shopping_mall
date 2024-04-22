import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;
  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async saveRefreshToken(userId: string, refreshToken: string, ttl: number): Promise<void> {
    try {
        await this.client.set(`refreshToken:${userId}`, refreshToken, 'EX', ttl);
    } catch (error) {
        console.error('실패햇습니다', error);
        throw error; // 선택적: 오류를 다시 throw하여 상위 로직에서 처리할 수 있도록 함
    }
}
}

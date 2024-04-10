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
    await this.client.set(`refreshToken:${userId}`, refreshToken, 'EX', ttl);
}
  


}

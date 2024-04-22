import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedisService {
  private readonly client: Redis;
  // private readonly clients: Redis[];
  // private readonly maxClients: number;
  constructor(
    private readonly configService: ConfigService,
    // maxClients: number,
    // options: RedisOptions
  ) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    })
    // this.maxClients = maxClients;
    // this.clients = [];
  }

 getClient(): Redis {
    return this.client;
  }

redlock(client): Redlock {
  const redlock = new Redlock(
    [client],
    {
      //시간 동기화
      driftFactor: 0.01,
      //재시도 횟수
      retryCount: 10,
      //재시도 간 간격
      retryDelay: 200,
      //최대 딜레이 시간
      retryJitter:300,
      //잠금 만료 연장 하는 시점
      automaticExtensionThreshold: 100,
    }
  )
  return redlock
}
}



// public async getClientLock(): Promise<Redis> {
//   if(this.clients.length < this.maxClients) {
//     const client = new Redis({
//       host: this.configService.get<string>('REDIS_HOST'),
//       port: this.configService.get<number>('REDIS_PORT'),
//       password: this.configService.get<string>('REDIS_PASSWORD'),
//     })
//     this.clients.push(client);
//     return client;
//   } else {
//     throw new Error('Reached maximum number of clients')
//   }
// }

// public async releaseClient(client: Redis): Promise<void> {
//   const index = this.clients.indexOf(client);
//   //인덱스가 존재하는 경우에 분기점으로 진입
//   if(index !== -1) {
//     this.clients.splice(index, 1);
//     await client.quit()
//   }
// }
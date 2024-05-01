import { Module } from '@nestjs/common';
import { TossService } from './toss.service';
import { TossController } from './toss.controller';
import { TossHistory } from 'src/payments/entities/tossHistory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/orders/entities/orders.entity';


@Module({
  imports: [TypeOrmModule.forFeature([TossHistory, Orders])],
  controllers: [TossController],
  providers: [TossService,],
  exports: [TossService],
})
export class TossModule {}

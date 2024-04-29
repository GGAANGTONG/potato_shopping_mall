import { Module } from '@nestjs/common';
import { TossService } from './toss.service';
import { TossController } from './toss.controller';
import { TossHistory } from 'src/payments/entities/tossHistory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([TossHistory])],
  controllers: [TossController],
  providers: [TossService,],
  exports: [TossService],
})
export class TossModule {}

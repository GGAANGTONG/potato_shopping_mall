import { Module } from '@nestjs/common';
import { TossService } from './toss.service';
import { TossController } from './toss.controller';


@Module({
  imports: [],
  controllers: [TossController],
  providers: [TossService,],
  exports: [TossService],
})
export class TossModule {}

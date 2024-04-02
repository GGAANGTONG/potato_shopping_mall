import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { Point } from './entities/point.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Point]),
  ], 
  providers: [PointService],
  controllers: [PointController],
  exports:[PointService],
})
export class PointModule {}

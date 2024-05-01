import { Module } from '@nestjs/common';
import { MangementService } from './mangement.service';
import { MangementController } from './mangement.controller';
import { Mangement } from './entities/mangement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Mangement])],
  controllers: [MangementController],
  providers: [MangementService],
  exports: [MangementService],
})
export class MangementModule {}

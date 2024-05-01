import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MangementService } from './mangement.service';
import { Mangement } from './entities/mangement.entity';


@Controller('mangement')
export class MangementController {
  constructor(private readonly mangementService: MangementService) {}


  @Get(':goods_id')
   find(@Param('goods_id') goods_id): Promise<Mangement[]> {
    return this.mangementService.findGoods(goods_id);
  }

  @Post('transfer')
  async transferGoods(
    @Body('goods_id') goods_id: number,
    @Body('source_storage_id') source_storage_id: number,
    @Body('destination_storage_id') destination_storage_id: number,
    @Body('transferCount') transferCount: number
  ): Promise<{ source: Mangement, destination: Mangement }> {
    return this.mangementService.transferGoods(goods_id, source_storage_id, destination_storage_id, transferCount);
  }
}
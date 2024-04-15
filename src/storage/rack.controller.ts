import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RackService } from './rack.service';
import { CreateRacksDto } from './dto/create-racks.dto';
import { UpdateRacksDto } from './dto/update-racks.dto';
import { AddGoodsToRackDto } from './dto/create-goods-racks.dto';
@Controller('racks')
export class RacksController {
  constructor(private readonly rackService: RackService) {}

  /**
   * 랙 등록
   * @param createRacksDto 
   * @returns
   */
  @Post()
  create(@Body() createRacksDto: CreateRacksDto) {
    return this.rackService.create(createRacksDto);
  }

  /**
   * 랙 리스트 조회
   * @returns 
   */
  @Get('rack-storage/:storageId')
  findAll(@Param('storageId') storageId: string) {
    return this.rackService.findAllByStorage(+storageId);
  }

  /**
   * 랙 하나 상세조회
   * @param id 
   * @returns 
   */
  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.rackService.findOne(+id);
  }

  /**
   * 상품 새로 적재
   * @param body 
   * @returns 
   */
  @Post('add-goods')
  addGoodsToRack(@Body() addGoodsToRackDto: AddGoodsToRackDto) {
    return this.rackService.addGoodsToRack(addGoodsToRackDto);
  }

  /**
   * 창고 정보 수정
   * @param id 
   * @param updateRacksDto 
   * @returns 
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRacksDto: UpdateRacksDto) {
    return this.rackService.update(+id, updateRacksDto);
  }

  /**
   * 창고 삭제
   * @param id 
   * @returns 
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rackService.remove(+id);
  }
}

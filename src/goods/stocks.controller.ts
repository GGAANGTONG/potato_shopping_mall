import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stocks.dto';
import { UpdateStockDto } from './dto/update-stocks.dto';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  /**
   * 재고 등록
   * @param
   * @returns
   */
  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stocksService.create(createStockDto);
  }

  /**
   * 상품 재고 조회
   * @returns
   */
  @Get('all')
  findAll() {
    return this.stocksService.findAll();
  }

  /**
   * 상품 카테고리 하나 상세조회
   * @param id
   * @returns
   */
  @Get('by-id/:id')
  findOne(@Param('id') id: number) {
    return this.stocksService.findOne(+id);
  }

  @Get('by-goods/:goodsId')
  findOneByGoodsId(@Param('goodsId') goodsId: number) {
    return this.stocksService.findOneByGoodsId(+goodsId);
  }

  /**
   * 재고 정보 수정(입출고)
   * @param id
   * @param CreateStockDto
   * @returns
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stocksService.update(+id, updateStockDto);
  }

  /**
   * 재고 정보 삭제
   * @param id
   * @returns
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stocksService.remove(+id);
  }
}

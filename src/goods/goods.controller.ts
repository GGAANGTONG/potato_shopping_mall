import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { CreateGoodDto } from "./dto/create-goods.dto";
import { UpdateGoodDto } from "./dto/update-goods.dto";
@Controller("goods")
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  /**
   * 상품등록
   * @param createGoodDto
   * @returns
   */
  @Post()
  create(@Body() createGoodDto: CreateGoodDto) {
    return this.goodsService.create(createGoodDto);
  }

  @Get()
  findAll() {
    return this.goodsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.goodsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGoodDto: UpdateGoodDto) {
    return this.goodsService.update(+id, updateGoodDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.goodsService.remove(+id);
  }
}

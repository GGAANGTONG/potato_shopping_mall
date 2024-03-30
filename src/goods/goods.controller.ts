import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
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

  /**
   * 상품 전체 조회
   * @returns
   */
  @Get()
  findAll(
    @Query("g_name") g_name?: string,
    @Query("cate_id") cate_id?: string,
  ) {
    return this.goodsService.findAll(g_name, cate_id);
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

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
   * 상품 조회
   * @param g_name
   * @param cate_id
   * @returns
   */
  @Get()
  findAll(
    @Query("g_name") g_name?: string,
    @Query("cate_id") cate_id?: string,
  ) {
    return this.goodsService.findAll(g_name, cate_id);
  }

  /**
   * 상품 하나 상세조회
   * @param id
   * @returns
   */
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.goodsService.findOne(+id);
  }

  /**
   * 상품 정보 수정
   * @param id
   * @param updateGoodDto
   * @returns
   */
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateGoodDto: UpdateGoodDto) {
    return this.goodsService.update(+id, updateGoodDto);
  }

  /**
   * 상품 정보 삭제
   * @param id 
   * @returns 
   */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.goodsService.remove(+id);
  }
}

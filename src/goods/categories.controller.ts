import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * 상품 카테고리 등록
   * @param createCategoryDto
   * @returns
   */
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * 상품 카테고리 조회
   * @returns
   */
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * 상품 카테고리 하나 상세조회
   * @param id
   * @returns
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(+id);
  }

  /**
   * 상품 카테고리 정보 수정
   * @param id
   * @param updateCategoryDto
   * @returns
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.update(+id, createCategoryDto);
  }

  /**
   * 상품 카테고리 정보 삭제
   * @param id
   * @returns
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}

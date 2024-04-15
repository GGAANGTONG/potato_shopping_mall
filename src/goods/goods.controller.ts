import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodDto } from './dto/create-goods.dto';
import { UpdateGoodDto } from './dto/update-goods.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResizeImagePipe } from '../common/pipe/resize-image.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  /**
   * 상품등록
   * @param file
   * @param createGoodDto
   * @returns
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(new ResizeImagePipe(400, 400)) file: Express.Multer.File,
    @Body() createGoodDto: CreateGoodDto,
  ) {
    return this.goodsService.create(file, createGoodDto);
  }

  /**
   * 상품 조회
   * @param g_name
   * @param cate_id
   * @returns
   */
  @Get()
  findAll(
    @Query('g_name') g_name?: string,
    @Query('cate_id') cate_id?: string,
  ) {
    return this.goodsService.findAll(g_name, cate_id);
  }

  /**
   * 상품 하나 상세조회
   * @param id
   * @returns
   */
  @Get('get-one/:id')
  findOne(@Param('id') id: number) {
    return this.goodsService.findOne(+id);
  }

  @Get('get-one-stocks/:id')
  findOneWithTotalStock(@Param('id') id: number) {
    return this.goodsService.findOneWithTotalStock(+id);
  }

  /**
   * 상품 정보 수정
   * @param id
   * @param updateGoodDto
   * @returns
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateGoodDto: UpdateGoodDto,
    @UploadedFile(new ResizeImagePipe(400, 400)) file: Express.Multer.File,
  ) {
    return this.goodsService.update(+id, updateGoodDto, file);
  }

  /**
   * 상품 정보 삭제
   * @param id
   * @returns
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.goodsService.remove(+id);
  }
}

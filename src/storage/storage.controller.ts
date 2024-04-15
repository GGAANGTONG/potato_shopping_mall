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
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * 창고 등록
   * @param createStorageDto  ('name', 'address',   'postal_code', 'contact_name', 'contact_phone', 'is_available')
   * @returns
   */
  @Post()
  create(@Body() createStorageDto: CreateStorageDto) {
    return this.storageService.create(createStorageDto);
  }

  /**
   * 창고 리스트 조회
   * @param name 
   * @param address 
   * @param contactName 
   * @returns 
   */
  @Get()
  findAll(@Query('name') name?: string, @Query('address') address?: string, @Query('contactName') contactName?: string) {
    return this.storageService.findAll(name, address, contactName);
  }

  /**
   * 창고 하나 상세조회
   * @param id 
   * @returns 
   */
  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.storageService.findOne(+id);
  }

  /**
   * 적재 가능한 창고만 조회
   * @returns 현재 적재 가능한 모든 창고의 리스트
   */
  @Get('available')
  findAvailable() {
    return this.storageService.findAvailable();
  }

  /**
   * 창고 정보 수정
   * @param id 
   * @param updateStorageDto 
   * @returns 
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorageDto: UpdateStorageDto) {
    return this.storageService.update(+id, updateStorageDto);
  }

  /**
   * 창고 삭제
   * @param id 
   * @returns 
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(+id);
  }
}

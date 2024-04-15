import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Storage } from './entities/storage.entity';
import { Racks } from './entities/rack.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private storageRepository: Repository<Storage>,
    @InjectRepository(Racks)
    private racksRepository: Repository<Racks>,
  ) {}

  /**
   * 창고 등록
   * @param createStorageDto ('name', 'address',   'postal_code', 'contact_name', 'contact_phone', 'is_available')
   * @returns newStorage
   */
  async create(createStorageDto: CreateStorageDto) {
    const newStorage = this.storageRepository.create(createStorageDto);
    await this.storageRepository.save(newStorage);
    return newStorage;
  }

  /**
   * 전체 창고 조회
   * @returns
   */
  async findAll(name?: string, address?: string, contactName? : string) {
    let whereCondition = {};

    if (name) {
      whereCondition = { ...whereCondition, name: Like(`%${name}%`) };
    }

    if (address) {
      whereCondition = { ...whereCondition, address: Like(`%${address}%`) };
    }

    if (contactName) {
      whereCondition = { ...whereCondition, contact_name: Like(`%${contactName}%`) };
    }

    const storages = await this.storageRepository.find({
      where: whereCondition,
    });

    return storages;
  }
  async findAvailable() {
    const storages = this.storageRepository.find({
      where: { is_available: true },
    });
    return storages;
  }

  /**
   * 창고 상세 조회
   * @param id 
   * @returns 
   */
  async findOne(id: number) {
    const storage = await this.storageRepository.findOne({
      where: { id: +id },
      relations: ['racks']
    });

    if (!storage) {
      throw new NotFoundException('해당 창고 정보를 찾을 수 없습니다.');
    }
    return storage;
  }

  /**
   * 창고 정보 업데이트
   * @param id 
   * @param updateStorageDto 
   * @returns message: '창고 정보가 성공적으로 업데이트되었습니다.', storage 
   */
  async update(id: number, updateStorageDto: UpdateStorageDto) {
    const storage = await this.storageRepository.preload({
      id: +id,
      ...updateStorageDto,
    });
  
    if (!storage) {
      throw new NotFoundException('해당 창고를 찾을 수 없습니다.');
    }
  
    try {
      await this.storageRepository.save(storage);
      return { message: '창고 정보가 성공적으로 업데이트되었습니다.', storage };
    } catch (error) {
      throw new InternalServerErrorException(`#${id} 창고 정보 업데이트 중 문제가 발생했습니다.`);
    }
  }

  async remove(id: number) {
    const storage = await this.storageRepository.findOne({
      where: { id: +id }
    });

    if (!storage) {
      throw new NotFoundException('해당 창고 정보를 찾을 수 없습니다.');
    }

    try {
      await this.storageRepository.remove(storage);
      return { message: '창고 정보가 성공적으로 삭제되었습니다.' };
    } catch (error) {
      throw new InternalServerErrorException('창고 정보 삭제 중 문제가 발생했습니다.');
    }
  }
}

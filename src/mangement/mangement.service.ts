// src/products/mangement.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Mangement } from './entities/mangement.entity';
import { error } from 'console';

@Injectable()
export class MangementService {
  constructor(
    @InjectRepository(Mangement)
    private mangementRepository: Repository<Mangement>,
  ) {}

   findGoods(goods_id): Promise<Mangement[]> {
    const {goods_id: number} = goods_id
    const result = this.mangementRepository.find({
      where: { goods_id: number },
      
      select: ['g_name', 'm_name', 'racks_id', 'stock_id', 'count']
    });
    if(!result){
      throw new error(`해당 ${goods_id}가 없습니다 `);
    }
    return result
}

async transferGoods(goods_id: number, source_storage_id: number, destination_storage_id: number, transferCount: number): Promise<{ source: Mangement, destination: Mangement }> {
  const sourceStorage = await this.mangementRepository.findOne({
      where: {
          storage_id: source_storage_id, 
          goods_id: goods_id,
          count: MoreThan(0)  
      }
  });

  if (!sourceStorage) {
    throw new Error(` ${source_storage_id} 존재하지않거나 부족합니다`);
  }

  if (sourceStorage.count < transferCount) {
    throw new Error('부족합니다');
  }

  let destinationStorage = await this.mangementRepository.findOne({
      where: {
          storage_id: destination_storage_id, 
          goods_id: goods_id
      }
  });

  if (!destinationStorage) {
    destinationStorage = this.mangementRepository.create({
      storage_id: destination_storage_id,
      goods_id: goods_id,
      count: 0
    });
  }

  sourceStorage.count -= transferCount;
  destinationStorage.count += transferCount;

  await this.mangementRepository.save([sourceStorage, destinationStorage]);

  return {
      source: sourceStorage,
      destination: destinationStorage
  };
}
}
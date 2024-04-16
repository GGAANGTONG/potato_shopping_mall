import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRacksDto } from './dto/create-racks.dto';
import { UpdateRacksDto } from './dto/update-racks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from './entities/storage.entity';
import { Racks } from './entities/rack.entity';
import { Goods } from '../goods/entities/goods.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import { AddGoodsToRackDto } from './dto/create-goods-racks.dto';

@Injectable()
export class RackService {
  constructor(
    @InjectRepository(Storage)
    private storageRepository: Repository<Storage>,
    @InjectRepository(Racks)
    private racksRepository: Repository<Racks>,
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
    @InjectRepository(Stocks)
    private stocksRepository: Repository<Stocks>,
  ) {}

  /**
   * 랙 등록
   * @param createRacksDto
   * @returns newRack
   */
  async create(createRacksDto: CreateRacksDto) {
    const existedStorage = await this.storageRepository.findOneBy({
      id: +createRacksDto.storage_id,
    });
    if (!existedStorage) {
      throw new NotFoundException('랙을 등록할 창고 정보를 찾을 수 없습니다.');
    }

    try {
      const newRack = this.racksRepository.create(createRacksDto);
      newRack.storage = existedStorage;
      await this.racksRepository.save(newRack);

      return newRack;
    } catch (error) {
      throw new InternalServerErrorException('랙 등록 중 문제가 발생했습니다.');
    }
  }

  /**
   * 특정 창고의 전체 랙 조회
   * @returns
   */
  async findAllByStorage(storageId: number) {
    const racks = await this.racksRepository
      .createQueryBuilder('rack')
      .leftJoinAndSelect('rack.stock', 'stock')
      .leftJoinAndSelect('stock.goods', 'goods', 'goods.id = stock.goods.id')
      .select([
        'rack.id', // 랙 ID
        'rack.name',
        'rack.location_info',
        'stock.id', // 재고 ID
        'stock.count',
        'goods.g_name', // 상품 이름
        'goods.g_desc',
      ])
      .where('rack.storage_id = :storageId', { storageId })
      .getMany();

    return racks;
  }

  /**
   * 랙 상세 조회
   * @param id
   * @returns
   */
  async findOne(id: number) {
    const rack = await this.racksRepository.findOne({
      where: { id: +id },
      relations: ['stock', 'stock.goods'],
    });

    if (!rack) {
      throw new NotFoundException('해당 랙 정보를 찾을 수 없습니다.');
    }
    return rack;
  }

  /**
   * 랙에 상품 적재하기
   * @param rackId
   * @param goodsId
   * @returns
   */
  async addGoodsToRack(addGoodsToRackDto: AddGoodsToRackDto): Promise<Racks> {
    const { rack_id, goods_id, quantity } = addGoodsToRackDto;

    try {
      return await this.racksRepository.manager.transaction(
        async (entityManager) => {
          const rack = await entityManager.findOne(Racks, {
            where: { id: rack_id },
          });

          if (!rack) {
            throw new NotFoundException('해당 랙 정보를 찾을 수 없습니다.');
          }
          const goods = await entityManager.findOne(Goods, {
            where: { id: goods_id },
          });

          if (!goods) {
            throw new NotFoundException('해당하는 상품을 찾을 수 없습니다.');
          }

          // 중복 상품 체크
          const existingGoodsInRack = await entityManager.findOne(Stocks, {
            where: {
              goods: { id: goods_id },
              rack: { id: rack_id },
            },
          });
          if (existingGoodsInRack) {
            throw new BadRequestException(
              '이미 해당 랙에 동일한 상품이 존재합니다.',
            );
          }

          // 랙과 상품 재고 저장
          await entityManager.save(rack);

          // Stocks 엔티티 생성 및 저장
          const newStock = entityManager.create(Stocks, {
            goods: goods,
            rack: rack,
            count: quantity,
          });
          await entityManager.save(newStock);

          return rack;
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        '랙에 상품 적재 중 문제가 발생했습니다.',
        error.message,
      );
    }
  }

  /**
   * 창고 정보 업데이트
   * @param id
   * @param updateStorageDto
   * @returns message: '창고 정보가 성공적으로 업데이트되었습니다.', storage
   */
  async update(id: number, updateRacksDto: UpdateRacksDto) {
    const storage = await this.storageRepository.preload({
      id: +id,
      ...updateRacksDto,
    });

    if (!storage) {
      throw new NotFoundException('해당 창고를 찾을 수 없습니다.');
    }

    try {
      await this.storageRepository.save(storage);
      return { message: '창고 정보가 성공적으로 업데이트되었습니다.', storage };
    } catch (error) {
      throw new InternalServerErrorException(
        `창고 정보 업데이트 중 문제가 발생했습니다.`,
      );
    }
  }

  /**
   * 랙 삭제
   * @param id
   * @returns
   */
  async remove(id: number) {
    const rack = await this.racksRepository.findOne({
      where: { id: +id },
    });

    if (!rack) {
      throw new NotFoundException('해당 랙 정보를 찾을 수 없습니다.');
    }

    try {
      await this.racksRepository.remove(rack);
      return { message: '랙 정보가 성공적으로 삭제되었습니다.' };
    } catch (error) {
      throw new InternalServerErrorException(
        '랙 정보 삭제 중 문제가 발생했습니다.',
      );
    }
  }
}

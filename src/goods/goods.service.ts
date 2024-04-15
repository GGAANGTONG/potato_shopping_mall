import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGoodDto } from './dto/create-goods.dto';
import { UpdateGoodDto } from './dto/update-goods.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Goods } from './entities/goods.entity';
import { Categories } from './entities/categories.entity';
import { Stocks } from './entities/stocks.entity';
import { Repository } from 'typeorm';
import { S3FileService } from '../common/utils/s3_fileupload';
import { Racks } from '../storage/entities/rack.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Stocks)
    private stocksRepository: Repository<Stocks>,
    @InjectRepository(Racks)
    private racksRepository: Repository<Racks>,
    private readonly s3FileService: S3FileService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  /**
   * 상품등록
   * @param file
   * @param createGoodDto
   * @returns
   */
  async create(file: Express.Multer.File, createGoodDto: CreateGoodDto) {
    const { rack_id } = createGoodDto;

    const existedCategory = await this.categoriesRepository.findOneBy({
      id: createGoodDto.category,
    });
    if (!existedCategory) {
      throw new NotFoundException('해당하는 카테고리를 찾을 수 없습니다.');
    }

    const existedRack = await this.racksRepository.findOneBy({
      id: +rack_id,
    });
    if (!existedRack) {
      throw new NotFoundException('해당하는 랙을 찾을 수 없습니다.');
    }

    try {
      let fileKey = '';
      // 상품 이미지 버킷에 업로드
      if (file) {
        fileKey = await this.s3FileService.uploadFile(file, 'goods');
      }
      const { g_name, cost_price, g_desc, g_option } = createGoodDto;
      const goodData = { g_name, cost_price, g_desc, g_img: fileKey, g_option };
      const newGood = this.goodsRepository.create(goodData);
      newGood.category = existedCategory;

      // 상품 정보 저장
      const savedGood = await this.goodsRepository.save(newGood);

      return newGood;
    } catch (error) {
      throw new InternalServerErrorException(
        '상품 생성 중 에러가 발생했습니다.',
      );
    }
  }

  /**
   * 전체조회
   * @param g_name
   * @param cate_id
   * @returns
   */
  async findAll(g_name?: string, cate_id?: string) {
    const query = this.goodsRepository
      .createQueryBuilder('goods')
      .leftJoinAndSelect('goods.category', 'category')
      .select([
        'goods.id',
        'goods.g_name',
        'goods.g_price',
        'goods.g_desc',
        'category.c_name',
      ]);

    if (g_name) {
      query.andWhere('goods.g_name LIKE :g_name', { g_name: `%${g_name}%` });
    }

    if (cate_id) {
      query.andWhere('goods.cate_id = :cate_id', { cate_id });
    }
    return query.getMany();
  }

  /**
   * 상세조회
   * @param id number
   * @returns
   */
  async findOne(id: number): Promise<Goods> {
    const good = await this.goodsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!good) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }
    return good;
  }

  /**
   * 상품 정보 (재고 합계 포함하여)
   * @param id
   * @returns
   */
  async findOneWithTotalStock(id: number): Promise<any> {
    try {
      const result = await this.dataSource.manager.query(
        'CALL GetGoodsWithTotalStock_S(?)',
        [id],
      );
      // 결과의 첫 번째 부분(실제 데이터)만 반환
      return result[0];
    } catch (error) {
      console.error('프로시저에서 에러 발생:', error);
      throw new InternalServerErrorException('서버 내부 오류가 발생했습니다.');
    }
  }

  /**
   * 상품 정보 수정
   * @param id
   * @param updateGoodDto
   */
  async update(
    id: number,
    updateGoodDto: UpdateGoodDto,
    file: Express.Multer.File,
  ) {
    const good = await this.goodsRepository.findOneBy({ id });
    if (!good) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    const existedCategory = await this.categoriesRepository.findOneBy({
      id: updateGoodDto.category,
    });
    if (!existedCategory) {
      throw new NotFoundException('해당하는 카테고리를 찾을 수 없습니다.');
    }

    // 이미지가 존재하고, 이미 업로드된 이미지가 있다면 기존 이미지 삭제
    if (file && good.g_img) {
      try {
        await this.s3FileService.deleteFile(good.g_img);
      } catch (error) {
        throw new InternalServerErrorException(
          '이미지 파일 수정 중 에러가 발생했습니다.',
        );
      }
    }

    // 새로운 파일이 있다면 업로드

    const fileKey = file
      ? await this.s3FileService.uploadFile(file, 'goods')
      : good.g_img;

    // 수정할 상품 데이터 업데이트
    good.g_name = updateGoodDto.g_name;
    good.g_price = updateGoodDto.g_price;
    good.g_desc = updateGoodDto.g_desc;
    good.g_option = updateGoodDto.g_option;
    good.g_img = fileKey;
    good.category = existedCategory;

    try {
      const updatedGood = await this.goodsRepository.save(good);
      return updatedGood;
    } catch (error) {
      throw new InternalServerErrorException(
        '상품 업데이트 중 에러가 발생했습니다.',
      );
    }
  }

  async remove(id: number) {
    const good = await this.goodsRepository.findOneBy({ id });
    if (!good) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    if (good.g_img) {
      try {
        await this.s3FileService.deleteFile(good.g_img);
      } catch (error) {
        throw new InternalServerErrorException(
          '파일 삭제 처리 중 에러가 발생했습니다.',
        );
      }
    }

    try {
      await this.goodsRepository.delete(id);
      return { message: '상품이 성공적으로 삭제되었습니다.', data: good };
    } catch (error) {
      throw new InternalServerErrorException(
        '상품 삭제 처리 중 에러가 발생했습니다.',
      );
    }
  }
}

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGoodDto } from './dto/create-goods.dto';
import { UpdateGoodDto } from './dto/update-goods.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goods } from './entities/goods.entity';
import { Categories } from './entities/categories.entity';
import { Stocks } from './entities/stocks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Stocks)
    private stocksRepository: Repository<Stocks>,
  ) {}

  async create(createGoodDto: CreateGoodDto) {
    const existedCategory = await this.categoriesRepository.findOneBy({
      id: createGoodDto.category,
    });
    if (!existedCategory) {
      throw new NotFoundException('해당하는 카테고리를 찾을 수 없습니다.');
    }

    try {
      const { g_name, g_price, g_desc, g_img, g_option } = createGoodDto;
      const goodData = { g_name, g_price, g_desc, g_img, g_option };
      const newGood = this.goodsRepository.create(goodData);
      newGood.category = existedCategory;
      await this.goodsRepository.save(newGood);
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
      .leftJoinAndSelect('goods.stock', 'stocks')
      .select([
        'goods.id',
        'goods.g_name',
        'goods.g_price',
        'goods.g_desc',
        'category.c_name',
        'stocks.count',
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
      relations: ['category', 'stock'],
    });
    if (!good) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }
    return good;
  }

  /**
   * 상품 정보 수정
   * @param id
   * @param updateGoodDto
   */
  async update(id: number, updateGoodDto: UpdateGoodDto) {
    const good = await this.goodsRepository.findOneBy({ id });
    if (!good) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    try {
      const updatedGood = this.goodsRepository.merge(good, updateGoodDto);
      await this.goodsRepository.save(updatedGood);
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

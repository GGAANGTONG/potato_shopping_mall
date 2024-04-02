import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stocks } from './entities/stocks.entity';
import { Goods } from './entities/goods.entity';
import { CreateStockDto } from './dto/create-stocks.dto';
import { UpdateStockDto } from './dto/update-stocks.dto';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stocks)
    private stocksRepository: Repository<Stocks>,
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
  ) {}

  /**
   * 재고 등록
   * @param createStockDto
   * @returns
   */
  async create(createStockDto: CreateStockDto): Promise<Stocks> {
    const goods = await this.goodsRepository.findOneBy({
      id: createStockDto.goods_id,
    });
    if (!goods) {
      throw new NotFoundException('해당하는 상품을 찾을 수 없습니다.');
    }
    const newStock = this.stocksRepository.create({
      count: createStockDto.count,
      goods: goods,
    });

    await this.stocksRepository.save(newStock);
    return newStock;
  }

  /**
   * 전체 재고 조회
   * @returns
   */
  async findAll() {
    const query = this.stocksRepository
      .createQueryBuilder('stocks')
      .leftJoinAndSelect('stocks.goods', 'goods')
      .select([
        'stocks.id',
        'stocks.count',
        'goods.id',
        'goods.g_price',
        'goods.g_name',
      ]);

    return query.getMany();
  }

  /**
   * 재고 상세조회
   * @param id number
   * @returns Promise<Stocks>
   */
  async findOne(id: number): Promise<Stocks> {
    const stock = await this.stocksRepository.findOne({
      where: { id },
      relations: ['goods'],
    });
    if (!stock) {
      throw new NotFoundException('해당 상품 재고 정보를 찾을 수 없습니다.');
    }
    return stock;
  }

  /**
   * 특정 상품 ID에 대한 재고 정보 조회
   * @param goodsId 상품 ID
   * @returns Promise<Stocks>
   */
  async findOneByGoodsId(goodsId: number): Promise<Stocks> {
    const good = await this.goodsRepository.findOneBy({ id: goodsId });

    if (!good) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    const stock = await this.stocksRepository.findOne({
      where: { goods: { id: goodsId } },
      relations: ['goods'],
    });
    console.log('stock : ' + stock);
    if (!stock) {
      throw new NotFoundException(
        '해당하는 상품의 재고 정보를 찾을 수 없습니다.',
      );
    }
    return stock;
  }

  /**
   * 입출고
   * @param id
   * @param createStockDto
   */
  async update(id: number, updateStockDto: UpdateStockDto): Promise<Stocks> {
    const stock = await this.stocksRepository.findOneBy({ id });
    if (!stock) {
      throw new NotFoundException('해당 상품 재고 정보를 찾을 수 없습니다.');
    }

    stock.count = updateStockDto.count;
    await this.stocksRepository.save(stock);
    return stock;
  }

  async remove(id: number) {
    const stock = await this.stocksRepository.findOneBy({ id });
    if (!stock) {
      throw new NotFoundException('해당 재고 데이터를 찾을 수 없습니다.');
    }

    try {
      await this.stocksRepository.delete(id);
      return {
        message: '재고 데이터가 성공적으로 삭제되었습니다.',
        data: stock,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '재고 데이터 삭제 처리 중 에러가 발생했습니다.',
      );
    }
  }
}

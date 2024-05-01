import {
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
import logger from 'src/common/log/logger';
import { RedisService } from '../redis/redis.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import * as _ from 'lodash';

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
    private readonly redisService: RedisService,
    private readonly elasticsearchService: ElasticsearchService,
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
  async findAll(g_name?: string, cate_id?: string, page = 1, pageSize = 10) {
    let from = (page - 1) * pageSize;
    if (!_.isNil(cate_id) && _.isNil(g_name)) {
      const data = await this.redisService
        .getClient()
        .get(`cate_id = ${cate_id}`);

      if (!_.isNil(data)) {
        return data;
      }
    } else if (_.isNil(g_name)) {
      const getCachedData = await this.redisService
        .getClient()
        .get('goods-findAll');

      if (!_.isNil(getCachedData)) {
        return getCachedData;
      }
    }

    let searchQuery = {
      index: 'goods_index',
      size: pageSize,
      from: (page - 1) * pageSize, 
      body: {
        query: {
          bool: {
            must: [],
          },
        },
      },
    };

    if (g_name) {
      searchQuery.body.query.bool.must.push({
        wildcard: {
          name: g_name + '*',
        },
      });
    }

    if (cate_id) {
      searchQuery.body.query.bool.must.push({
        match: {
          category: cate_id,
        },
      });
    }

    if (searchQuery.body.query.bool.must.length === 0) {
      delete searchQuery.body.query.bool.must;
    }
    try {
      const { body } = await this.elasticsearchService.search(
        'goods_index',
        JSON.stringify(searchQuery.body, null, 2),
        searchQuery.size,
        searchQuery.from
      );
      console.log(JSON.stringify(searchQuery.size))

      //const data = await query.getMany();

      if (!body.hits.hits.length) {
        const error = new NotFoundException('데이터를 찾을 수 없습니다.');
        logger.errorLogger(error, `g_name=${g_name}, cate_id=${cate_id}`);
        //throw error;
      }

      if (_.isNil(cate_id) && _.isNil(g_name)) {
        await this.redisService
          .getClient()
          .set(
            'goods-findAll',
            JSON.stringify(body.hits.hits.map((hit) => hit._source)),
            'EX',
            20,
          );
      } else if (cate_id) {
        await this.redisService
          .getClient()
          .set(
            `cate_id = ${cate_id}`,
            JSON.stringify(body.hits.hits.map((hit) => hit._source)),
            'EX',
            60,
          );
      }

      return {
        total: body.hits.total.value, // 총 문서 수
        results: body.hits.hits.map((hit) => hit._source),
        page,
        pageSize,
      };
    } catch (error) {
      console.error('오픈 서치 연결 실패:', error.message);
      throw new InternalServerErrorException('상품 명단 조회에 실패했습니다.');
    }
  }

  /**
   * 상세조회
   * @param id number
   * @returns
   */
  async findOne(id: number): Promise<Goods> {
    const query = {
      query: {
        match: {
          _id: id.toString(),
        },
      },
    };
    const good = await this.elasticsearchService.search('goods_index', query);

    if (!good.body.hits.hits.length) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    // return good;
    return good.body.hits.hits.map((hit) => hit._source);
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
   * 특가 상품 찾기
   * @returns 
   */
  async findHighestDiscountedProduct(): Promise<Goods> {
    const query = {
      "size": 1, 
      "sort": [
        { "discountRate": { "order": "asc" } }
      ],
      "query": {
        "range": {
          "discountRate": {
            "gte": 0
          }
        }
      }
    };
  
    const result = await this.elasticsearchService.search('goods_index', query);
  
    if (!result.body.hits.hits.length) {
      throw new NotFoundException('할인 상품을 찾을 수 없습니다.');
    }
  
    return result.body.hits.hits[0]._source; 
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

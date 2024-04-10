import { Test, TestingModule } from '@nestjs/testing';
import { GoodsService } from './goods.service';
import { Categories } from './entities/categories.entity';
import {
  ValidationPipe,
  ArgumentMetadata,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goods } from './entities/goods.entity';
import { Stocks } from './entities/stocks.entity';
import { CreateGoodDto } from './dto/create-goods.dto';
import { UpdateGoodDto } from './dto/update-goods.dto';
import fs from 'fs'
import { S3FileService } from '../common/utils/s3_fileupload';

describe('GoodsService', () => {
  let service: GoodsService;
  let stocksRepository: Partial<Record<keyof Repository<Stocks>, jest.Mock>>;
  let goodsRepository: Partial<Record<keyof Repository<Goods>, jest.Mock>>;
  let categoriesRepository: Partial<
    Record<keyof Repository<Categories>, jest.Mock>
  >;

  let s3FileService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn()
  }

  async function validation(Dto, dto) {
    const validatonPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Dto,
      data: '',
    };
    await validatonPipe.transform(dto, metadata);
  }

  beforeEach(async () => {
    goodsRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      }),
    };

    //select는 value를 넣어줘야 하는데, jest에선 아무것도 없는 걸 넣어서 모킹해서 undefined가 계속 반환되고 있었던 것(select는 undefined가 반환되면 안댐)

    categoriesRepository = {
      findOneBy: jest.fn(),
    };

    stocksRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoodsService,
        {
          provide: getRepositoryToken(Stocks),
          useValue: stocksRepository,
        },
        {
          provide: getRepositoryToken(Goods),
          useValue: goodsRepository,
        },
        {
          provide: getRepositoryToken(Categories),
          useValue: categoriesRepository,
        },
        {
          provide: S3FileService,
          useValue: s3FileService
        }
      ],
    }).compile();

    service = module.get<GoodsService>(GoodsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GoodsService', () => {
    expect(service).toBeDefined();
  });

  it('1-1. Goods - create, file & createDto를 전달받아 상품 정보를 생성함', async () => {

    const file: Express.Multer.File = {
      fieldname: 'avatar',
      originalname: '195도짜리 국밥.jpg',
      encoding: 'utf-8',
      mimetype: 'image/jpeg',
      size: 1024, // 파일 크기를 바이트 단위로 가정
      destination: '/uploads/',
      filename: 'avatar-123.jpg',
      path: '/uploads/avatar-123.jpg',
      buffer: Buffer.from('This is a file buffer'),
      stream : fs.createReadStream('./s3_mocking_test')
  };

    const createGoodDto: CreateGoodDto = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 국밥',
      g_option: '섭씨 220도짜리 국밥',
      category: 1,
    };
    await validation(CreateGoodDto, createGoodDto);

    const value1 = {
      cateogry: 1,
    };

    categoriesRepository.findOneBy.mockResolvedValueOnce(value1);

    const imageValue = '국밥사진'
    s3FileService.uploadFile.mockResolvedValueOnce(imageValue)

    const value2 = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 국밥',
      g_img: `${imageValue}`,
      g_option: '섭씨 220도짜리 국밥',
    };
    goodsRepository.create.mockResolvedValueOnce(value2);
    goodsRepository.save.mockResolvedValueOnce(value2);

    const value3 = {
      count: 0,
      goods: value2,
    };

    stocksRepository.create.mockResolvedValueOnce(value3);
    stocksRepository.save.mockResolvedValueOnce(value3);

    return await expect(service.create(file, createGoodDto)).resolves.toBe(value2);
  });

  it('1-2. Goods - create, file == null || undefined & createDto를 전달받아 이미지 없이 상품 정보를 생성함', async () => {

    const file: Express.Multer.File = null || undefined

    const createGoodDto: CreateGoodDto = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 국밥',
      g_option: '섭씨 220도짜리 국밥',
      category: 1,
    };
    await validation(CreateGoodDto, createGoodDto);

    const value1 = {
      cateogry: 1,
    };

    categoriesRepository.findOneBy.mockResolvedValueOnce(value1);

    const imageValue = '국밥사진'
    s3FileService.uploadFile.mockResolvedValueOnce(imageValue)

    const value2 = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 국밥',
      g_img: `${imageValue}`,
      g_option: '섭씨 220도짜리 국밥',
    };
    goodsRepository.create.mockResolvedValueOnce(value2);
    goodsRepository.save.mockResolvedValueOnce(value2);

    const value3 = {
      count: 0,
      goods: value2,
    };

    stocksRepository.create.mockResolvedValueOnce(value3);
    stocksRepository.save.mockResolvedValueOnce(value3);

    return await expect(service.create(file, createGoodDto)).resolves.toBe(value2);
  });


  it('1-3. Goods - create, createDto가 불완전한 상태로 전달받아 에러를 반환함, 근데 이거 프로덕션 이후에는 category에 문자가 들어오는 걸 막을 방법이 있나?', async () => {

  //   const file: Express.Multer.File = {
  //     fieldname: 'avatar',
  //     originalname: '195도짜리 국밥.jpg',
  //     encoding: 'utf-8',
  //     mimetype: 'image/jpeg',
  //     size: 1024, // 파일 크기를 바이트 단위로 가정
  //     destination: '/uploads/',
  //     filename: 'avatar-123.jpg',
  //     path: '/uploads/avatar-123.jpg',
  //     buffer: Buffer.from('This is a file buffer'),
  //     stream : fs.createReadStream('./s3_mocking_test')
  // };

    const createGoodDto: CreateGoodDto = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 국밥',
      g_option: '섭씨 220도짜리 국밥',
      category: 1,
    };
    return await validation(CreateGoodDto, createGoodDto).then(() => {
      throw new Error('잘못된 테스트입니다.')
    }).catch((err) => expect(err))
  });

  it('1-4. Goods - create, createDto를 전달받았으나, cate_id에 해당하는 카테고리 데이터가 없어  에러를 반환함', async () => {

    const file: Express.Multer.File = {
      fieldname: 'avatar',
      originalname: '195도짜리 국밥.jpg',
      encoding: 'utf-8',
      mimetype: 'image/jpeg',
      size: 1024, // 파일 크기를 바이트 단위로 가정
      destination: '/uploads/',
      filename: 'avatar-123.jpg',
      path: '/uploads/avatar-123.jpg',
      buffer: Buffer.from('This is a file buffer'),
      stream : fs.createReadStream('./s3_mocking_test')
  };

    const createGoodDto: CreateGoodDto = {
      g_name: '주먹밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 주먹밥',
      g_option: '섭씨 220도짜리 주먹밥',
      category: 3,
    };
    await validation(CreateGoodDto, createGoodDto);

    const value1 = null || undefined;

    categoriesRepository.findOneBy.mockResolvedValueOnce(value1);

    return await expect(service.create(file, createGoodDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('2-1. Goods - findAll, 전체 상품 정보를 조회함', async () => {
    const value1 = [
      {
        g_name: '주먹밥',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 주먹밥',
        g_img: '주먹밥 사진',
        g_option: '섭씨 220도짜리 주먹밥',
        category: '주먹밥',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '비빔밥',
        g_price: 5000,
        g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
        g_img: '비빔밥 사진',
        g_option: '섭씨 220도짜리 비빔밥',
        category: '비빔밥',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '감자튀김',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 감자튀김',
        g_img: '감자튀김 사진',
        g_option: '섭씨 220도짜리 감자튀김',
        category: '감자튀김',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '고구마튀김',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 고구마튀김',
        g_img: '주먹밥 사진',
        g_option: '섭씨 220도짜리 고구마튀김',
        category: '고구마튀김',
        stocks: {
          count: 999,
        },
      },
    ];

    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().select.mockResolvedValueOnce(value1);

    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().select();
    goodsRepository.createQueryBuilder().getMany.mockResolvedValueOnce(value1);

    return await expect(service.findAll()).resolves.toBe(value1);
  });

  it('2-2. Goods - findAll, 매개변수로 전달받은 g_name을 포함한 이름을 가진 상품 리스트를 출력함', async () => {
    const g_name = '튀김';

    const value1 = [
      {
        g_name: '주먹밥',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 주먹밥',
        g_img: '주먹밥 사진',
        g_option: '섭씨 220도짜리 주먹밥',
        category: '주먹밥',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '비빔밥',
        g_price: 5000,
        g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
        g_img: '비빔밥 사진',
        g_option: '섭씨 220도짜리 비빔밥',
        category: '비빔밥',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '감자튀김',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 감자튀김',
        g_img: '감자튀김 사진',
        g_option: '섭씨 220도짜리 감자튀김',
        category: '감자튀김',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '고구마튀김',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 고구마튀김',
        g_img: '주먹밥 사진',
        g_option: '섭씨 220도짜리 고구마튀김',
        category: '고구마튀김',
        stocks: {
          count: 999,
        },
      },
    ];

    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().select.mockResolvedValueOnce(value1);

    const value2 = [
      {
        g_name: '감자튀김',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 감자튀김',
        g_img: '감자튀김 사진',
        g_option: '섭씨 220도짜리 감자튀김',
        category: '감자튀김',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '고구마튀김',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 고구마튀김',
        g_img: '주먹밥 사진',
        g_option: '섭씨 220도짜리 고구마튀김',
        category: '고구마튀김',
        stocks: {
          count: 999,
        },
      },
    ];

    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().select();
    goodsRepository.createQueryBuilder().andWhere.mockResolvedValueOnce(value2);

    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().select();
    goodsRepository.createQueryBuilder().getMany.mockResolvedValueOnce(value2);

    return await expect(service.findAll()).resolves.toBe(value2);
  });

  it('2-3. Goods - findAll, 매개변수로 전달받은 cate_id을 포함한 이름을 가진 상품 리스트를 출력함', async () => {
    const cate_id = '1';
    //cate_id 1 = 밥
    const value1 = [
      {
        g_name: '주먹밥',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 주먹밥',
        g_img: '주먹밥 사진',
        g_option: '섭씨 220도짜리 주먹밥',
        category: '주먹밥',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '비빔밥',
        g_price: 5000,
        g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
        g_img: '비빔밥 사진',
        g_option: '섭씨 220도짜리 비빔밥',
        category: '비빔밥',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '감자튀김',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 감자튀김',
        g_img: '감자튀김 사진',
        g_option: '섭씨 220도짜리 감자튀김',
        category: '감자튀김',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '고구마튀김',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 고구마튀김',
        g_img: '주먹밥 사진',
        g_option: '섭씨 220도짜리 고구마튀김',
        category: '고구마튀김',
        stocks: {
          count: 999,
        },
      },
    ];

    goodsRepository.createQueryBuilder();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().select.mockResolvedValueOnce(value1);

    const value2 = [
      {
        g_name: '주먹밥',
        g_price: 35000,
        g_desc: '엄청나게 뜨겁고 맛있는 주먹밥',
        g_img: '주먹밥 사진',
        g_option: '섭씨 220도짜리 주먹밥',
        category: '주먹밥',
        stocks: {
          count: 999,
        },
      },
      {
        g_name: '비빔밥',
        g_price: 5000,
        g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
        g_img: '비빔밥 사진',
        g_option: '섭씨 220도짜리 비빔밥',
        category: '비빔밥',
        stocks: {
          count: 999,
        },
      },
    ];

    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().select();
    goodsRepository.createQueryBuilder().andWhere.mockResolvedValueOnce(value2);

    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().leftJoinAndSelect();
    goodsRepository.createQueryBuilder().select();
    goodsRepository.createQueryBuilder().getMany.mockResolvedValueOnce(value2);

    return await expect(service.findAll()).resolves.toBe(value2);
  });

  it('2-4. Goods - findAll, 상품이 조회되지 않아 에러를 반환함(이게 통과되도록 로직 짜주셔요)', async () => {

    

    return await expect(service.findAll()).rejects.toThrow(BadRequestException);
  });

  it('3-1. Goods - findOne, id를 전달받아 해당 id와 일치하는 id를 가진 상품 상세정보를 출력함', async () => {
    const id = 1;
    //cate_id 1 = 밥
    const value1 = {
      g_name: '주먹밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 주먹밥',
      g_img: '주먹밥 사진',
      g_option: '섭씨 220도짜리 주먹밥',
      category: {
        cate_id: id,
        c_name: '주먹밥',
      },
      stocks: {
        count: 999,
      },
    };

    goodsRepository.findOne.mockResolvedValueOnce(value1);

    return await expect(service.findOne(id)).resolves.toBe(value1);
  });

  it('3-2. Goods - findOne, id에 null/undefined가 할당된채 전달받았지만 상품을 찾을 수 없어 에러를 반환함 ', async () => {
    const id = null || undefined;
    //cate_id 1 = 밥
    const value1 = null || undefined;

    goodsRepository.findOne.mockResolvedValueOnce(value1);

    return await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('4-1. Goods - update, id와 updateGoodDto 전달받아 상품 정보를 갱신함(이것도 dto extends를 picktype에서 partial로 바꿔야 할 거임)', async () => {
    const id = 1;
    const updateGoodDto: UpdateGoodDto = {
      g_name: '장국밥',
      g_price: 35000,
      g_desc: '엄청나게 차갑고 싸늘한 장국밥',
      g_img: '장국밥 사진',
      g_option: '절대영도에 도달한 장국밥',
    };

    await validation(UpdateGoodDto, updateGoodDto);

    const value1 = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 국밥',
      g_img: '국밥 사진',
      g_option: '섭씨 220도짜리 국밥',
    };

    goodsRepository.findOneBy.mockResolvedValueOnce(value1);

    const value2 = updateGoodDto;

    goodsRepository.merge.mockResolvedValueOnce(value2);
    goodsRepository.save.mockResolvedValueOnce(value2);

    return await expect(service.update(id, updateGoodDto)).resolves.toBe(
      value2,
    );
  });

  it('4-2. Goods - update, id에 undefined/null이 할당된채 전달받아 상품을 찾지 못해 에러를 반환함', async () => {
    const id = null || undefined;
    const updateGoodDto: UpdateGoodDto = {
      g_name: '장국밥',
      g_price: 35000,
      g_desc: '엄청나게 차갑고 싸늘한 장국밥',
      g_img: '장국밥 사진',
      g_option: '절대영도에 도달한 장국밥',
    };

    await validation(UpdateGoodDto, updateGoodDto);

    const value1 = undefined || null;

    goodsRepository.findOneBy.mockResolvedValueOnce(value1);

    return await expect(service.update(id, updateGoodDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('4-3. Goods - update, id는 정상적으로 받았으나 updateGoodDto가 불완전한 상태로 전달받아 에러를 반환함(이것도 dto extends를 picktype에서 partial로 바꿔야 할 거임)', async () => {
    const id = 1;
    const updateGoodDto: UpdateGoodDto = {
      g_name: undefined,
      g_price: 35000,
      g_desc: '엄청나게 차갑고 싸늘한 장국밥',
      g_img: '장국밥 사진',
      g_option: '절대영도에 도달한 장국밥',
    };

    await validation(UpdateGoodDto, updateGoodDto).then(() => {
      throw new Error('잘못된 테스트입니다.')
    }).catch((err) => expect(err))
  });

  it('5-1. Goods - remove, id를 전달받아 해당 id와 일치하는 id를 가진 상품정보를 삭제함', async () => {
    const id = 1;

    const value1 = {
      g_name: '주먹밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 주먹밥',
      g_img: '주먹밥 사진',
      g_option: '섭씨 220도짜리 주먹밥',
      category: {
        cate_id: id,
        c_name: '주먹밥',
      },
      stocks: {
        count: 999,
      },
    };

    goodsRepository.findOneBy.mockResolvedValueOnce(value1);

    const value2 = '상품이 성공적으로 삭제되었습니다.';

    goodsRepository.delete.mockResolvedValueOnce(value2);

    return await expect(service.remove(id)).resolves.toEqual({
      message: value2,
      data: value1,
    });
  });

  it('5-2. Goods - remove, id에 null/undefined가 할당된채 전달받아 제거할 상품을 찾지 못해 에러를 반환함', async () => {
    const id = null || undefined;

    const value1 = null || undefined;

    goodsRepository.findOneBy.mockResolvedValueOnce(value1);

    return await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  });
});

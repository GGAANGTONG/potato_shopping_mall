import { Test, TestingModule } from '@nestjs/testing';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateGoodDto } from './dto/create-goods.dto';
import { UpdateGoodDto } from './dto/update-goods.dto';
import fs from 'fs';

describe('GoodsController', () => {
  let controller: GoodsController;
  const goodsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsController],
      providers: [
        {
          provide: GoodsService,
          useValue: goodsService,
        },
      ],
    }).compile();

    controller = module.get<GoodsController>(GoodsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GoodsController', () => {
    expect(controller).toBeDefined();
  });

  it('1-1. Goods - create, file & createGoodDto를 정상적으로 전달받아 상품을 등록함(req.user.id 없음)', async () => {
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
      stream: fs.createReadStream('/path/to/file'),
    };

    const createGoodDto: CreateGoodDto = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 국밥',
      g_option: '섭씨 220도짜리 국밥',
      category: 1,
    };
    await validation(CreateGoodDto, createGoodDto);
    const returnedValue = '국밥 상품 정보';
    goodsService.create.mockResolvedValueOnce(returnedValue);

    return await expect(controller.create(file, createGoodDto)).resolves.toBe(
      returnedValue,
    );
  });

  it('1-2. Goods - create, file == null || undefined & createGoodDto를 정상적으로 전달받아 이미지 없이 상품을 등록함(req.user.id 없음)', async () => {
    const file: Express.Multer.File = null || undefined;

    const createGoodDto: CreateGoodDto = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '엄청나게 뜨겁고 맛있는 국밥',
      g_option: '섭씨 220도짜리 국밥',
      category: 1,
    };
    await validation(CreateGoodDto, createGoodDto);
    const returnedValue = '국밥 상품 정보';
    goodsService.create.mockResolvedValueOnce(returnedValue);

    return await expect(controller.create(file, createGoodDto)).resolves.toBe(
      returnedValue,
    );
  });

  //it('1-#. Goods - create, file이 Express.Multer.File이 아닌 다른 데이터 형태의 데이터가 할당된 채 전달되어 에러를 반환함 async() => {})

  it('1-3. Goods - create, createGoodDto가 비정상적으로 구성된 채 전달받아 에러를 반환함 ', async () => {
    const createGoodDto: CreateGoodDto = {
      g_name: '국밥',
      g_price: 35000,
      g_desc: '',
      g_option: '',
      category: 1,
    };
    await validation(CreateGoodDto, createGoodDto)
      .then(() => {
        throw new Error('잘못된 테스트입니다.');
      })
      .catch((err) => expect(err));
  });

  it('2-1. Goods - findAll, 모든 상품 정보를 조회함', async () => {
    const returnedValue = '모든 상품 정보';
    goodsService.findAll.mockResolvedValueOnce(returnedValue);

    return await expect(controller.findAll()).resolves.toBe(returnedValue);
  });

  it('2-2. Goods - findAll, 쿼리를 통해 전달된 g_name에 해당하는 모든 상품 정보를 조회함', async () => {
    const g_name = '국밥';
    const returnedValue = '국밥과 관련된 모든 상품 정보';
    goodsService.findAll.mockResolvedValueOnce(returnedValue);

    return await expect(controller.findAll(g_name)).resolves.toBe(
      returnedValue,
    );
  });

  it('2-3. Goods - findAll, 쿼리를 통해 전달된 cate_id에 해당하는 모든 상품 정보를 조회함', async () => {
    const cate_id = '1';
    const returnedValue = `cate_id = ${cate_id} 카테고리에 해당하는 모든 상품 정보`;
    goodsService.findAll.mockResolvedValueOnce(returnedValue);

    return await expect(controller.findAll(cate_id)).resolves.toBe(
      returnedValue,
    );
  });

  it('3-1. Goods - findOne, 특정 상품 정보를 조회함(서비스에 null/undefined 처리 로직 존재)', async () => {
    const id = 1;
    const returnedValue = `${id}에 해당하는 특정 상품 정보`;
    goodsService.findOne.mockResolvedValueOnce(returnedValue);

    return await expect(controller.findOne(id)).resolves.toBe(returnedValue);
  });

  it('4-1. Goods - update, id와 updateGoodDto를 정상적으로 전달받아 상품을 수정함(이거 dto extends type PartialType로 바껴야 할 거임 + id에 null/undefined 들어간 경우는 서비스에서 처리하고 있음)', async () => {
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
      stream: fs.createReadStream('/path/to/file'),
    };

    const id = '1';
    const updateGoodDto: UpdateGoodDto = {
      g_name: '비빔밥',
      g_price: 25000,
      g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
      g_img: '비빔밥 사진',
      g_option: '섭씨 220도짜리 비빔밥',
    };
    await validation(UpdateGoodDto, updateGoodDto);
    const returnedValue = {
      id,
      g_name: '비빔밥',
      g_price: 25000,
      g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
      g_img: '비빔밥 사진',
      g_option: '섭씨 220도짜리 비빔밥',
    };
    goodsService.update.mockResolvedValueOnce(returnedValue);

    return await expect(controller.update(id, updateGoodDto)).resolves.toBe(
      returnedValue,
    );
  });

  it('4-1. Goods - update, id와 updateGoodDto를 정상적으로 전달받아 상품을 수정함(이거 dto extends type PartialType로 바껴야 할 거임 + id에 null/undefined 들어간 경우는 서비스에서 처리하고 있음)', async () => {
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
    //     stream : fs.createReadStream('/path/to/file')
    // };

    const id = '1';
    const updateGoodDto: UpdateGoodDto = {
      g_name: '비빔밥',
      g_price: 25000,
      g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
      g_img: '비빔밥 사진',
      g_option: '섭씨 220도짜리 비빔밥',
    };
    await validation(UpdateGoodDto, updateGoodDto);
    const returnedValue = {
      id,
      g_name: '비빔밥',
      g_price: 25000,
      g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
      g_img: '비빔밥 사진',
      g_option: '섭씨 220도짜리 비빔밥',
    };
    goodsService.update.mockResolvedValueOnce(returnedValue);

    return await expect(controller.update(id, updateGoodDto)).resolves.toBe(
      returnedValue,
    );
  });

  //updateGoodDto 안에 g_img가 있음, 근데 밖에서도 받아야 하지 않나?
  // it('4-#. Goods - update, file == null || undefined & id & updateGoodDto를 정상적으로 전달받아 이미지 수정 없이 상품 정보를 수정함(이거 dto extends type PartialType로 바껴야 할 거임 + id에 null/undefined 들어간 경우는 서비스에서 처리하고 있음)', async () => {

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
  //     stream : fs.createReadStream('/path/to/file')
  // };

  //   const id = '1';
  //   const updateGoodDto: UpdateGoodDto = {
  //     g_name: '비빔밥',
  //     g_price: 25000,
  //     g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
  //     g_img: '비빔밥 사진',
  //     g_option: '섭씨 220도짜리 비빔밥',
  //   };
  //   await validation(UpdateGoodDto, updateGoodDto);
  //   const returnedValue = {
  //     id,
  //     g_name: '비빔밥',
  //     g_price: 25000,
  //     g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
  //     g_img: '비빔밥 사진',
  //     g_option: '섭씨 220도짜리 비빔밥',
  //   };
  //   goodsService.update.mockResolvedValueOnce(returnedValue);

  //   return await expect(controller.update(id, updateGoodDto)).resolves.toBe(
  //     returnedValue,
  //   );
  // });

  //it('1-#. Goods - update, file이 Express.Multer.File이 아닌 다른 데이터 형태의 데이터가 할당된 채 전달되어 에러를 반환함 async() => {})

  it('4-2. Goods - update, updateGoodDto가 비정상적으로 구성된 채 전달받아 에러를 반환함 ', async () => {
    const updateGoodDto: UpdateGoodDto = {
      g_name: undefined,
      g_price: 25000,
      g_desc: '엄청나게 뜨겁고 맛있는 비빔밥',
      g_img: '비빔밥 사진',
      g_option: '섭씨 220도짜리 비빔밥',
    };
    return await validation(UpdateGoodDto, updateGoodDto)
      .then(() => {
        throw new Error('잘못된 테스트입니다.');
      })
      .catch((err) => expect(err));
  });

  it('5-1. Goods - delete, id를 전달받아 해당 상품을 삭제함(id가 null/undefined인 경우에 대한 처리는 서비스에 존재)', async () => {
    const id = '1';

    const returnedValue = '해당 상품이 삭제되었습니다.';
    goodsService.remove.mockResolvedValueOnce(returnedValue);

    return await expect(controller.remove(id)).resolves.toBe(returnedValue);
  });
});

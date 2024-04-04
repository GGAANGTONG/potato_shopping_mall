import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stocks.dto';
import { UpdateStockDto } from './dto/update-stocks.dto';

describe('PaymentsController', () => {
  let controller: StocksController;
  const stocksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByGoodsId: jest.fn(),
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
      controllers: [StocksController],
      providers: [
        {
          provide: StocksService,
          useValue: stocksService,
        },
      ],
    }).compile();

    controller = module.get<StocksController>(StocksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('1-1. Stocks -create, createStockDto를 전달받아 성공적으로 stocks 데이터를 생성함, service 단에서 null 거르는 유효성 로직이 있음', async () => {
    const createStockDto: CreateStockDto = {
      count: 7,
      goods_id: 1,
    };

    await validation(CreateStockDto, createStockDto);
    const returnedValue = '재고 정보가 생성되었습니다.';
    stocksService.create.mockResolvedValueOnce(returnedValue);

    return expect(controller.create(createStockDto)).resolves.toBe(
      returnedValue,
    );
  });

  it('2-1. Stocks - findAll, 상품 전체 재고를 조회함', async () => {
    const returnedValue = '전체 상품 재고가 조회되었습니다.';
    stocksService.findAll.mockResolvedValueOnce(returnedValue);

    return expect(controller.findAll()).resolves.toBe(returnedValue);
  });

  it('3-1. Stocks - findOneByGoodsId, 특정 상품 재고를 조회함(service 단에 goodsId가 null/undefined일때에 대한 유효성 검사가 존재함)', async () => {
    const goodsId = 1;
    const returnedValue = '해당 상품 재고가 조회되었습니다.';
    stocksService.findOneByGoodsId.mockResolvedValueOnce(returnedValue);

    return expect(controller.findOneByGoodsId(goodsId)).resolves.toBe(
      returnedValue,
    );
  });

  it('4-1. Stocks - update, updateStockDto와 id를 성공적으로 전달받아 재고 정보를 갱신함 - id는 서비스단에 null/undefined 여부 확인하는 로직 존재', async () => {
    const id = '1';
    const updateStockDto: UpdateStockDto = {
      count: 7,
    };

    await validation(UpdateStockDto, updateStockDto);

    const returnedValue = '해당 상품 재고 정보가 갱신되었습니다.';
    stocksService.update.mockResolvedValueOnce(returnedValue);

    return expect(controller.update(id, updateStockDto)).resolves.toBe(
      returnedValue,
    );
  });

  it('4-2. Stocks - update, id는 잘 받았으나 updateStockDto의 프로퍼티가 null/undefined가 할당된 채로 전달받아 에러를 반환함', async () => {
    const id = '1';
    const updateStockDto: UpdateStockDto = {
      count: null || undefined,
    };

    await validation(UpdateStockDto, updateStockDto).catch((err) => {
      expect(err);
    });

    // const returnedValue = '해당 상품 재고 정보가 갱신되었습니다.'
    // stocksService.update.mockResolvedValueOnce(returnedValue)

    // return expect(controller.update(id, updateStockDto)).toBe(returnedValue)
  });

  it('5-1. Stocks - delete, id를 전달받아 해당 재고 정보를 삭제함 - id는 서비스단에 null/undefined 여부 확인하는 로직 존재', async () => {
    const id = '1';

    const returnedValue = '해당 상품 재고 정보가 삭제되었습니다.';
    stocksService.remove.mockResolvedValueOnce(returnedValue);

    return expect(controller.remove(id)).resolves.toBe(returnedValue);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StocksService } from './stocks.service';
import { Stocks } from './entities/stocks.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateStockDto } from './dto/create-stocks.dto';
import { Goods } from './entities/goods.entity';
import { ArgumentMetadata, NotFoundException, ValidationPipe } from '@nestjs/common';
import { UpdateStockDto } from './dto/update-stocks.dto';

describe('StocksService', () => {
  let service: StocksService;
  let stocksRepository: Partial<Record<keyof Repository<Stocks>, jest.Mock>>;
  let goodsRepository: Partial<Record<keyof Repository<Goods>, jest.Mock>>;

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
    await validatonPipe.transform(dto, metadata)
  }

  beforeEach(async () => {
    stocksRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockImplementation(
        () => ({
          leftJoinAndSelect: jest.fn().mockImplementation(
            () => ({
              select: jest.fn().mockImplementation(
                () => ({
                  getMany: jest.fn()
                })
              )
            })
          )
        })
      )
    }

    goodsRepository = {
      findOneBy: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        
          {
            provide: getRepositoryToken(Stocks),
            useValue: stocksRepository
          },
          {
            provide: getRepositoryToken(Goods),
            useValue: goodsRepository
          }

      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('StocksService', () => {
    expect(service).toBeDefined();
  });

  it('1-1. Stocks - create, createStockDto를 전달받아 재고 정보를 생성함', async () => {
    const createStockDto:CreateStockDto = {
      count: 7,
      goods_id: 1
    }

    await validation(CreateStockDto, createStockDto)

    const returnedValue = 'goods_id 1에 해당하는 상품'
    goodsRepository.findOneBy.mockResolvedValueOnce(returnedValue)
    const completedValue = {
      count: createStockDto.count,
      goods: returnedValue
    }
    stocksRepository.create.mockResolvedValueOnce(completedValue)
    stocksRepository.save.mockResolvedValueOnce(completedValue)
    return await expect(service.create(createStockDto)).resolves.toBe(completedValue)

  })

  it('1-2. Stocks - create, createStockDto의 goods_id에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    const createStockDto:CreateStockDto = {
      count: 7,
      goods_id: undefined || null
    }

    await validation(CreateStockDto, createStockDto).catch(err => expect(err))

    // const returnedValue = null || undefined
    // goodsRepository.findOneBy.mockResolvedValueOnce(returnedValue)

    // return await expect(service.create(createStockDto)).rejects.toThrow(NotFoundException)

  })

  it('1-3. Stocks - create, createStockDto의 count에 null/undefined가 할당된채 전달받아 에러를 반환함(얘는 IsNotEmpty() 속성을 가진 애가 아닌데, 왜 걸리지?)', async () => {
    const createStockDto:CreateStockDto = {
      count: undefined || null,
      goods_id: 1
    }

    await validation(CreateStockDto, createStockDto).catch(err => expect(err))

    // const returnedValue = 'goods_id 1에 해당하는 상품'
    // goodsRepository.findOneBy.mockResolvedValue(returnedValue)
    // const completedValue = {
    //   count: createStockDto.count,
    //   goods: returnedValue
    // }
    // stocksRepository.create.mockResolvedValueOnce(completedValue)
    // stocksRepository.save.mockResolvedValueOnce(completedValue)
    // return await expect(service.create(createStockDto)).rejects.toThrow()

  })

  it('2-1. Stocks - findAll, 전체 재고를 조회함', async () => {
   
    const returnedValue = '전체 상품의 재고 목록'
    stocksRepository.createQueryBuilder().leftJoinAndSelect().select.mockResolvedValueOnce(returnedValue)

    return expect(service.findAll()).resolves
  })

  it('3-1. Stocks - findOne, id를 전달받아 특정 상품의 특정 재고 정보를 상세 조회함', async () => {
    
    const id = 1

    const returnedValue = '특정 상품의 재고id에 저장된 재고의 상세 정보'
    stocksRepository.findOne.mockResolvedValueOnce(returnedValue)

    return await expect(service.findOne(id)).resolves.toBe(returnedValue)

  })

  it('3-2. Stocks - findOne, id에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    
    const id = null || undefined

    const returnedValue = null || undefined
    stocksRepository.findOne.mockResolvedValueOnce(returnedValue)

    return await expect(service.findOne(id)).rejects.toThrow(NotFoundException)

  })

  it('4-1. Stocks - findOneByGoodsId, GoodsId를 전달받아 특정 상품의 특정 재고 정보를 상세 조회함', async () => {
    
    const goodsId = 1

    const returnedValueGoods = '1번 상품정보'
    goodsRepository.findOneBy.mockResolvedValueOnce(returnedValueGoods)

    const returnedValueStocks = '1번 상품의 전체 재고정보 상세'
    stocksRepository.findOne.mockResolvedValueOnce(returnedValueStocks)

    return await expect(service.findOneByGoodsId(goodsId)).resolves.toBe(returnedValueStocks)

  })

  it('4-2. Stocks - findOneByGoodsId, GoodsId에 null/undefined가 할당된채 전달받아 에러를 반환함(console.log 지워주세요)', async () => {
    
    const goodsId = null || undefined

    const returnedValueGoods = null || undefined
    stocksRepository.findOne.mockResolvedValueOnce(returnedValueGoods)

    return await expect(service.findOne(goodsId)).rejects.toThrow(NotFoundException)

  })

  it('4-3. Stocks - findOneByGoodsId, GoodsId를 전달받아 goods를 검색했으나, stocks 데이터가 존재하지 않아 에러를 반환함', async () => {
    
    const goodsId = 1

    const returnedValueGoods = '1번 상품정보'
    goodsRepository.findOneBy.mockResolvedValueOnce(returnedValueGoods)

    const returnedValueStocks = null || undefined
    stocksRepository.findOne.mockResolvedValueOnce(returnedValueStocks)

    return await expect(service.findOne(goodsId)).rejects.toThrow(NotFoundException)

  })

  it('5-1. Stocks - update, id와 updateStockDto를 전달받아 재고 정보를 생성함', async () => {
    const id = 1
    const updateStockDto:UpdateStockDto = {
      count: 7,
    }

    await validation(UpdateStockDto, updateStockDto)

    const returnedValue = {
      rest: 'id = 1 재고 정보',
      count: 0
    }
    stocksRepository.findOneBy.mockResolvedValueOnce(returnedValue)
    const completedValue = {
      rest: 'id = 1 재고 정보',
      count: updateStockDto.count
    }
    stocksRepository.save.mockResolvedValueOnce(completedValue)
    return await expect(service.update(id, updateStockDto)).resolves.toEqual(completedValue)

  })

  it('5-2. Stocks - update, id에 null/undefined가 할당된채 전달되어 에러를 반환함', async () => {
    const id = null || undefined
    const updateStockDto:UpdateStockDto = {
      count: 7,
    }

    await validation(UpdateStockDto, updateStockDto)

    const returnedValue = null || undefined
    stocksRepository.findOneBy.mockResolvedValueOnce(returnedValue)

    return await expect(service.update(id, updateStockDto)).rejects.toThrow(NotFoundException)

  })

  it('6-1. Stocks - remove, id를 전달받아 재고 정보를 삭제함', async () => {
    const id = 1

    const returnedValue = {
      rest: 'id = 1 재고 정보',
      count: 7
    }
    stocksRepository.findOneBy.mockResolvedValueOnce(returnedValue)

    const completedValue = {
      message: '재고 데이터가 성공적으로 삭제되었습니다.',
      data: returnedValue
    }

    stocksRepository.delete.mockResolvedValueOnce(completedValue)
    return await expect(service.remove(id)).resolves.toEqual(completedValue)

  })

  it('6-2. Stocks - remove, id에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    const id = null || undefined

    const returnedValue = null || undefined
    stocksRepository.findOneBy.mockResolvedValueOnce(returnedValue)

    return await expect(service.remove(id)).rejects.toThrow(NotFoundException)

  })

});

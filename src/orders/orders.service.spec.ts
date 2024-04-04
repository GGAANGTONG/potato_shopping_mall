import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Orders } from './entities/orders.entity';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PaymentsService', () => {
  let service: OrdersService;
  let ordersRepository: Partial<Record<keyof Repository<Orders>, jest.Mock>>;
  
  
  const dataSource = {
    createQueryRunner: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      release: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      manager: {
        update: jest.fn(),
        save: jest.fn(), 
        create: jest.fn(),
        findOne: jest.fn()
     }
    }))
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
    await validatonPipe.transform(dto, metadata)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService, 
        {
          provide: DataSource,
          useValue: dataSource
        },
        {
          provide: getRepositoryToken(Orders),
          useValue: ordersRepository
        }
        ],
    }).compile();

    ordersRepository = {
      create: jest.fn(),
      save: jest.fn()
    }

    

    service = module.get<OrdersService>(OrdersService);
  })
  

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('1-1. Orders - purchase, userId와 createOrderDto를 정상적으로 전송받아 결제 완료를 반환함', async () => {
    const mockQueryRunner = await dataSource.createQueryRunner()

    const userId = 1
    const createOrderDto:CreateOrderDto = {
      o_tel: '010-0000-0000',
      o_addr: '국밥광역시 국밥구 국밥동 국밥아파트',
      o_count: 15,
      o_req: '섭씨 150도짜리 국밥',
      goods_id: 1
    }
    await validation(CreateOrderDto, createOrderDto)

    dataSource.createQueryRunner().connect()

    mockQueryRunner.manager.findOne.mockResolvedValueOnce('구매하려는 상품').mockResolvedValueOnce('구매를 원하는 유저')
    
    mockQueryRunner.manager.update.mockResolvedValueOnce('재고 갱신')
    mockQueryRunner.manager.save.mockResolvedValueOnce('유저 포인트 갱신')

  })


});


// const dataSource: () => MockType<DataSource> = jest.fn(() => ({
//   createQueryRunner: jest.fn().mockImplementation(() => ({
//     connect: jest.fn(),
//     startTransaction: jest.fn(),
//     release: jest.fn(),
//     commitTransaction: jest.fn(),
//     rollbackTransaction: jest.fn(),
//     manager: {
//       update: jest.fn(),
//       save: jest.fn(), 
//       create: jest.fn(),
//       findOne: jest.fn()
//    }
//   }))
// }))
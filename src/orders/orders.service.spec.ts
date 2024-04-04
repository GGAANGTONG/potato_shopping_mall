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

  // type MockType<T> = {
  //   [P in keyof T]?: jest.Mock<T>;
  // };
  //이걸 하려면 manager도 따로 모킹 타입 정의를 해줘야 함. jest.Mock<DataSource>가 돼서 그냥 전부 실제 DataSource 함수들이 들어가게 됨
  // const dataSource: Partial<MockType<DataSource>> = {
  //   createQueryRunner: jest.fn().mockImplementation(() => ({
  //     connect: jest.fn(),
  //     startTransaction: jest.fn(),
  //     release: jest.fn(),
  //     commitTransaction: jest.fn(),
  //     rollbackTransaction: jest.fn(),
  //     manager: {
  //       update: jest.fn().mockImplementation(),
  //       save: jest.fn().mockReturnThis(),
  //       create: jest.fn().mockReturnThis(),
  //       findOne: jest.fn().mockImplementation(),
  //     },
  //   })),
  // };

 
  const dataSource = {
    createQueryRunner: jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        release: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        manager:{
          update: jest.fn(),
          save: jest.fn(),
          create: jest.fn(),
          findOne: jest.fn()
        }})
    ),
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: DataSource,
          useValue: dataSource,
        },
        {
          provide: getRepositoryToken(Orders),
          useValue: ordersRepository,
        },
      ],
    }).compile();

    ordersRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('1-1. Orders - purchase, userId와 createOrderDto를 정상적으로 전송받아 결제 완료를 반환함', async () => {
    const queryRunner = await dataSource.createQueryRunner();

    const userId = 1;
    const createOrderDto: CreateOrderDto = {
      o_tel: '010-0000-0000',
      o_addr: '국밥광역시 국밥구 국밥동 국밥아파트',
      o_count: 15,
      o_req: '섭씨 150도짜리 국밥',
      goods_id: 1,
    };
    await validation(CreateOrderDto, createOrderDto);
    
    const value1 = {
      id: createOrderDto.goods_id,
      g_price: 1000,
      stock: {
        count: 100
      }
    }

    const value2 = {
      id: userId,
      points: 100000
    }
        
    await queryRunner.connect()
    await queryRunner.startTransaction()

    await queryRunner.manager.findOne.mockResolvedValueOnce(value1).mockResolvedValueOnce(value2)

    console.log('국밥-테스트', await queryRunner.manager.findOne())


    const value3 = '재고 정보 갱신'
    await queryRunner.manager.update.mockResolvedValueOnce(value3)
    const value4 = '유저 포인트 정보 갱신'
    await queryRunner.manager.save.mockResolvedValueOnce(value4)

    const returnedValue = '주문 정보'
    ordersRepository.create.mockResolvedValueOnce(returnedValue)
    ordersRepository.save.mockResolvedValueOnce(returnedValue)

    // await queryRunner.commitTransaction()
    // await queryRunner.release()

    return await expect(service.purchase(userId, createOrderDto)).resolves.toBe(returnedValue)
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Orders } from './entities/orders.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payments } from '../payments/entities/payments.entity';
import { Users } from '../user/entities/user.entitiy';
import { Point } from '../point/entities/point.entity';
import { Stocks } from '../goods/entities/stocks.entity';
import { Goods } from '../goods/entities/goods.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Partial<Record<keyof Repository<Orders>, jest.Mock>>;
  let usersRepository: Partial<Record<keyof Repository<Users>, jest.Mock>>;
  let pointRepository: Partial<Record<keyof Repository<Point>, jest.Mock>>;
  let paymentsRepository: Partial<Record<keyof Repository<Payments>, jest.Mock>>;


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

    // {
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
  //       findOne: jest.fn(),
  //     },
  //   })),
  // };
  let dataSource: DataSource

  const qr = {
    manager: {}
  } as QueryRunner;

  class DataSourceMock {
    createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
      return qr;
    }
  }

  beforeEach(async () => {
    Object.assign(qr.manager, {
        update: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        findOne: jest.fn()
    });
    qr.connect = jest.fn()
    qr.startTransaction = jest.fn()
    qr.commitTransaction = jest.fn()
    qr.rollbackTransaction = jest.fn()
    qr.release = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: DataSource,
          useClass: DataSourceMock
        },
        {
          provide: getRepositoryToken(Orders),
          useValue: ordersRepository,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepository,
        },
        {
          provide: getRepositoryToken(Point),
          useValue: pointRepository,
        },
        {
          provide: getRepositoryToken(Payments),
          useValue: paymentsRepository,
        },
      ],
    }).compile();

    ordersRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    

    service = module.get<OrdersService>(OrdersService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('1-1. Orders - purchase, userId와 createOrderDto를 정상적으로 전송받아 결제 완료를 반환함', async () => {
    const queryRunner = dataSource.createQueryRunner();

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
        count: 100,
      },
    };

    const value2 = {
      id: userId,
      points: 100000,
    };

    await queryRunner.connect();
    await queryRunner.startTransaction();

    jest.spyOn(queryRunner.manager, 'findOne').mockResolvedValueOnce(value1).mockResolvedValueOnce(value1)
    

    //기존의 함수가 가지고 있었던 의존성을 jest 인스턴스가 가진 의존성으로 대체함

    // const value3 = '재고 정보 갱신';
    // await queryRunner.manager.update.mockResolvedValueOnce(value3);
    // const value4 = '유저 포인트 정보 갱신';
    // await queryRunner.manager.save.mockResolvedValueOnce(value4);

    jest.spyOn(queryRunner.manager, 'update').mockResolvedValueOnce({
      raw:  value1,
      generatedMaps: [Stocks]
    }
  )

    jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(value2)

  const value3 = {
    raw: {
      o_name: '주문 정보'
    },
    generatedMaps: [Orders]
  }

    jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(value3)


    jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(value3)


    await queryRunner.commitTransaction()
    await queryRunner.release()

    return await expect(service.purchase(userId, createOrderDto)).resolves.toBe(
      value3,
    );
  });
});
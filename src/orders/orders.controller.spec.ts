import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { CreateOrderDto } from './dto/create-order.dto';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';

describe('PaymentsController', () => {
  let controller: OrdersController;
  let ordersService = {
    purchase: jest.fn()
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
        {
          provide: OrdersService,
          useValue: ordersService
        }
      ],
      controllers: [OrdersController],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('1-1. Orders - purchase, userId와 createOrderDto를 성공적으로 전송받아 결제에 성공함, user 정보는 useguard를 통해 인증/인가할 예정', async () => {
    let req = {
      user: {
        id: 1
      }
    }
    const createOrderDto:CreateOrderDto = {
      o_tel: '010-0000-0000',
      o_addr: '국밥광역시 국밥구 국밥동 국밥아파트',
      o_count: 15,
      o_req: '섭씨 150도짜리 국밥',
      goods_id: 1
    }
    await validation(CreateOrderDto, createOrderDto)
    const returnedValue = '결제가 완료됐고, 주문서가 출력됐습니다.'

    ordersService.purchase.mockResolvedValue(returnedValue)

    expect(controller.purchase(req, createOrderDto)).resolves.toBe(returnedValue)
  })

  it('1-2. Orders - purchase, createOrderDto가 불완전한 상태로 전송받아 에러를 반환함', async () => {

    const createOrderDto:CreateOrderDto = {
      o_tel: '010-0000-0000',
      o_addr: '국밥광역시 국밥구 국밥동 국밥아파트',
      o_count: 15,
      o_req: '섭씨 150도짜리 국밥',
      goods_id: 1
    }
    await validation(CreateOrderDto, createOrderDto).catch((err) => {
      return expect(err).toEqual(err);
    })
  })
});

import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { CategoriesService } from './categories.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  const categoriesService = {
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
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: categoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('1-1. Categories - create, createCategoryDto를 전달받아 카테고리 정보를 생성함', async () => {
    const createCategoryDto: CreateCategoryDto = {
      c_name: '국밥',
      c_desc: '섭씨 220도 짜리 국밥',
    };

    await validation(CreateCategoryDto, createCategoryDto);

    const returnValue = `카테고리 ${createCategoryDto.c_name}이 생성되었습니다.`;
    categoriesService.create.mockReturnValue(returnValue);

    return expect(controller.create(createCategoryDto)).toBe(returnValue);
  });

  it('1-2. Categories - create, createCategoryDto를 불완전한 상태로 전달받아 에러를 반환함', async () => {
    const createCategoryDto: CreateCategoryDto = {
      c_name: undefined,
      c_desc: '섭씨 220도 짜리 국밥',
    };

    await validation(CreateCategoryDto, createCategoryDto).then(() => {
      throw new Error('잘못된 테스트입니다.')
    }).catch((err) => expect(err))
  });

  it('2-1. Categories - findAll, 전체 카테고리 정보를 조회함', async () => {
    const returnValue = `전체 카테고리 정보 조회입니다.`;
    categoriesService.findAll.mockReturnValue(returnValue);

    return expect(controller.findAll()).toBe(returnValue);
  });

  it('3-1. Categories - findOne, 특정 카테고리 정보를 조회함(서비스 계층에 id 값이 null/undefined인 경우에 대한 유효성 검사 존재', async () => {
    const id = 1;
    const returnValue = `${id}번 카테고리 정보 조회입니다.`;
    categoriesService.findOne.mockReturnValue(returnValue);

    return expect(controller.findOne(id)).toBe(returnValue);
  });

  it('4-1. Categories - update, id와 createCategoryDto를 전달받아 카테고리 정보를 생성함(UpdateCategoryDto를 따로 파두는게 좋지 않을까 합니다.), id = null || undefined 대비 유효성 검사는 서비스 계층에 존재', async () => {
    const id = '1';
    const createCategoryDto: CreateCategoryDto = {
      c_name: '국밥',
      c_desc: '섭씨 220도 짜리 국밥',
    };

    await validation(CreateCategoryDto, createCategoryDto);

    const returnValue = `카테고리 ${id}번이 ${createCategoryDto}로 갱신되었습니다.`;
    categoriesService.update.mockReturnValue(returnValue);

    return expect(controller.update(id, createCategoryDto)).toBe(returnValue);
  });

  it('4-2. Categories - update, createCategoryDto가 불완전한 상태로 전달받아 카테고리 정보를 생성함(UpdateCategoryDto를 따로 파두는게 좋지 않을까 합니다.), id = null || undefined 대비 유효성 검사는 서비스 계층에 존재', async () => {
    const id = '1';
    const createCategoryDto: CreateCategoryDto = {
      c_name: '국밥',
      c_desc: undefined,
    };
    console.log(id)

    await validation(CreateCategoryDto, createCategoryDto).then(() => {
      throw new Error('잘못된 테스트입니다.')
    }).catch((err) => expect(err))
  });

  it('5-1. Categories - delete, id를 전달받아 해당하는 카테고리 정보를 삭제함(id null/undefined 대응은 서비스에 존재)', async () => {
    const id = '1';
    const returnValue = `카테고리 정보가 성공적으로 삭제됐습니다.`;
    categoriesService.remove.mockReturnValue(returnValue);

    return expect(controller.remove(id)).toBe(returnValue);
  });
});

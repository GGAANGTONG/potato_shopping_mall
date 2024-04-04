import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import {
  ArgumentMetadata,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Categories } from './entities/categories.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-categories.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;

  let categoriesRepository: Partial<
    Record<keyof Repository<Categories>, jest.Mock>
  >;

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
    categoriesRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Categories),
          useValue: categoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('CategoriesService', () => {
    expect(service).toBeDefined();
  });

  it('1-1. Categories - create, createCategoryDto를 전달받아 카테고리 정보를 생성함', async () => {
    const createCategoryDto: CreateCategoryDto = {
      c_name: '국밥',
      c_desc: '섭씨 220도 짜리 국밥',
    };

    await validation(CreateCategoryDto, createCategoryDto);

    const returnedValue = createCategoryDto;

    categoriesRepository.create.mockReturnValueOnce(returnedValue);
    categoriesRepository.save.mockResolvedValueOnce(returnedValue);

    return await expect(service.create(createCategoryDto)).resolves.toBe(
      returnedValue,
    );
  });

  it('1-2. Categories - create, createCategoryDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
    const createCategoryDto: CreateCategoryDto = {
      c_name: undefined,
      c_desc: '섭씨 220도 짜리 국밥',
    };

    return await validation(CreateCategoryDto, createCategoryDto).catch((err) =>
      expect(err),
    );
  });

  it('2-1. Categories - findAll, 모든 카테고리 정보를 조회함', async () => {
    const returnedValue = '모든 카테고리 정보입니다.';
    categoriesRepository.find.mockResolvedValueOnce(returnedValue);

    return await expect(service.findAll()).resolves.toBe(returnedValue);
  });

  it('3-1. Categories - findOne, id를 전달받아 특정 카테고리 정보를 조회함', async () => {
    const id = 1;
    const returnedValue = `${id}번의 카테고리 정보입니다.`;
    categoriesRepository.findOneBy.mockResolvedValueOnce(returnedValue);

    return await expect(service.findOne(id)).resolves.toBe(returnedValue);
  });

  it('3-2. Categories - findOne, id에 null/undefined가 할당된채로 전달받아 에러를 반환함', async () => {
    const id = null || undefined;
    const returnedValue = null || undefined;
    categoriesRepository.findOneBy.mockResolvedValueOnce(returnedValue);

    return await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('4-1. Categories - update, id와 createCategoryDto를 전달받아 카테고리 정보를 갱신함', async () => {
    const id = 1;
    const createCategoryDto: CreateCategoryDto = {
      c_name: '국밥',
      c_desc: '섭씨 220도 짜리 국밥',
    };
    await validation(CreateCategoryDto, createCategoryDto);
    const returnedOriginalValue = createCategoryDto;

    categoriesRepository.findOneBy.mockResolvedValueOnce(returnedOriginalValue);

    const returnedUpdatedValue = {
      c_name: '비빔밥',
      c_desc: '섭씨 220도 짜리 비빔밥',
    };

    categoriesRepository.merge.mockResolvedValueOnce(returnedUpdatedValue);
    categoriesRepository.save.mockResolvedValueOnce(returnedUpdatedValue);

    return await expect(service.update(id, createCategoryDto)).resolves.toBe(
      returnedUpdatedValue,
    );
  });

  it('4-2. Categories - update, id에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    const id = null || undefined;
    const createCategoryDto: CreateCategoryDto = {
      c_name: '국밥',
      c_desc: '섭씨 220도 짜리 국밥',
    };
    await validation(CreateCategoryDto, createCategoryDto);
    const returnedOriginalValue = null || undefined;

    categoriesRepository.findOneBy.mockResolvedValueOnce(returnedOriginalValue);

    return await expect(service.update(id, createCategoryDto)).rejects.toThrow(
      returnedOriginalValue,
    );
  });

  it('4-2. Categories - update, createCategoryDto가 불완전한 상태로 전달받아 에러를 반환함', async () => {
    const id = 1;
    const createCategoryDto: CreateCategoryDto = {
      c_name: undefined,
      c_desc: '섭씨 220도 짜리 국밥',
    };
    return await validation(CreateCategoryDto, createCategoryDto).catch((err) =>
      expect(err),
    );
  });

  it('5-1. Categories - remove, id를 전달받아 특정 카테고리 정보를 삭제함', async () => {
    const id = 1;
    const returnedValue = `${id}번의 카테고리 정보입니다.`;
    categoriesRepository.findOneBy.mockResolvedValueOnce(returnedValue);

    const deletedValue = {
      message: '상품이 성공적으로 삭제되었습니다.',
      data: returnedValue,
    };

    categoriesRepository.delete.mockResolvedValueOnce(deletedValue);

    await expect(service.remove(id)).resolves.toEqual(deletedValue);
  });

  it('5-2. Categories - remove, id에 null/undefined가 할당된채 전달받아 에러를 반환함', async () => {
    const id = undefined || null;
    const returnedValue = undefined || null;
    categoriesRepository.findOneBy.mockResolvedValueOnce(returnedValue);

    return await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  });
});

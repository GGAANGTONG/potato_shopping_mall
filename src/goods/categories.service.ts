import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-categories.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Categories } from "./entities/categories.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.categoriesRepository.create(createCategoryDto);
      await this.categoriesRepository.save(newCategory);
      return newCategory;
    } catch (error) {
      throw new InternalServerErrorException(
        "상품 카테고리 생성 중 에러가 발생했습니다.",
      );
    }
  }

  async findAll(g_name?: string, cate_id?: string) {
    const query = this.categoriesRepository.createQueryBuilder("categories");

    if (g_name) {
      query.andWhere("categories.g_name LIKE :g_name", {
        g_name: `%${g_name}%`,
      });
    }

    if (cate_id) {
      query.andWhere("categories.cate_id = :cate_id", { cate_id });
    }

    return query.getMany();
  }

  /**
   * 상세조회
   * @param id number
   * @returns
   */
  async findOne(id: number): Promise<Categories> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException("해당 상품을 찾을 수 없습니다.");
    }
    return category;
  }

  /**
   * 상품 정보 수정
   * @param id
   * @param updateCategoryDto
   */
  async update(id: number, createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException("해당 상품을 찾을 수 없습니다.");
    }

    try {
      const updatedCategory = this.categoriesRepository.merge(
        category,
        createCategoryDto,
      );
      await this.categoriesRepository.save(updatedCategory);
      return updatedCategory;
    } catch (error) {
      throw new InternalServerErrorException(
        "상품 업데이트 중 에러가 발생했습니다.",
      );
    }
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException("해당 상품을 찾을 수 없습니다.");
    }

    try {
      await this.categoriesRepository.delete(id);
      return { message: "상품이 성공적으로 삭제되었습니다.", data: category };
    } catch (error) {
      throw new InternalServerErrorException(
        "상품 삭제 처리 중 에러가 발생했습니다.",
      );
    }
  }
}

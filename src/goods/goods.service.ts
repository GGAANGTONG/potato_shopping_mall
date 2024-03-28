import { Injectable } from "@nestjs/common";
import { CreateGoodDto } from "./dto/create-goods.dto";
import { UpdateGoodDto } from "./dto/update-goods.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Goods } from "./entities/goods.entity";
import { Repository } from "typeorm";

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
  ) {}

  async create(createGoodDto: CreateGoodDto) {
    const newGood = this.goodsRepository.create(createGoodDto);
    await this.goodsRepository.save(newGood);

    return newGood;
  }

  async findAll(g_name?: string, cate_id?: string) {
    const whereOptions = [];

    if (g_name) {
      whereOptions.push({ g_name: g_name });
    }

    if (cate_id) {
      whereOptions.push({ category: cate_id });
    }

    return this.goodsRepository.find({
      where: whereOptions.length > 0 ? whereOptions : {},
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} good`;
  }

  update(id: number, updateGoodDto: UpdateGoodDto) {
    return `This action updates a #${id}, ${updateGoodDto} good`;
  }

  remove(id: number) {
    return `This action removes a #${id} good`;
  }
}

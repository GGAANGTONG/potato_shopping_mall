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

  async findAll() {
    return `This action returns all goods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} good`;
  }

  update(id: number, updateGoodDto: UpdateGoodDto) {
    return `This action updates a #${id} good`;
  }

  remove(id: number) {
    return `This action removes a #${id} good`;
  }
}

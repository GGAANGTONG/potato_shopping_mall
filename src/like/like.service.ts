import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/users.service';
import { GoodsService } from '../goods/goods.service';
// import { UpdateLikeDto } from './dto/update-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private userService: UserService, // UserService 주입
    private goodsService: GoodsService,
  ) {}


  // db에 바로들어감
  async create(createLikeDto: CreateLikeDto): Promise<Like> {
    const { usersId, goodsId } = createLikeDto;

    const user = await this.userService.findOne(usersId);
    if (!user) {
      throw new NotFoundException(`해당 유저가 없습니다: ${usersId}`);
    }

    const goods = await this.goodsService.findOne(goodsId);
    if (!goods) {
      throw new NotFoundException(`해당 상품이 없습니다: ${goodsId}`);
    }

    const newLike = this.likeRepository.create(createLikeDto);

    await this.likeRepository.save(newLike);

    return newLike;
  }

  async findAll(usersId:number){
    const likes = await this.likeRepository.findOneBy({
   usersId,
    });
    return likes;
  }

  
  // findAll() {
  //   return `This action returns all like`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} like`;
  // }

  // update(id: number, updateLikeDto: UpdateLikeDto) {
  //   return `This action updates a #${id} like`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} like`;
  // }
}

import { Injectable } from '@nestjs/common';
// import { CreatePointDto } from "./dto/create-point.dto";
// import { UpdatePointDto } from "./dto/update-point.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from './entities/point.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointsRepository: Repository<Point>,
  ) {}

  // create(createPointDto: CreatePointDto) {
  //   return "This action adds a new point";
  // }

  // findAll() {
  //   return `This action returns all point`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} point`;
  // }

  // update(id: number, updatePointDto: UpdatePointDto) {
  //   return `This action updates a #${id} point`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} point`;
  // }
}

import { Injectable } from '@nestjs/common';
import { Orders } from './entities/orders.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(Orders)
        private odersRepository: Repository<Orders>,
    ) { }

    async create(createOrderDto: CreateOrderDto) {
        const newOrder = this.odersRepository.create(createOrderDto);
        await this.odersRepository.save(newOrder);

        return newOrder;
    }

    async findAll() {
        return `This action returns all goods`;
    }

    findOne(id: number) {
        return `This action returns a #${id} good`;
    }



}

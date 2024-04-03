import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "src/orders/entities/orders.entity";
import { Repository } from "typeorm";
import { Payments } from "./entities/payments.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payments)

        private paymentsRepository: Repository<Payments>,

    ) { }
}
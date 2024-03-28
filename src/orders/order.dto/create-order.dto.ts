import { PickType } from "@nestjs/swagger";
import { Orders } from "../order.entities/orders.entity";

export class CreateOrderDto extends PickType(Orders, ['o_name', 'o_tel', 'o_addr', 'o_count', 'o_total_price', 'o_req', 'status', 'o_date'] as const)
{

}

import { PickType } from "@nestjs/swagger";
import { Goods } from "../entities/goods.entity";

export class UpdateGoodDto extends PickType(Goods, [
  "g_name",
  "g_price",
  "g_desc",
  "g_img",
  "g_option",
] as const) {}

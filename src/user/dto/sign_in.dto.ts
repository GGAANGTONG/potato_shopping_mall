import { PickType } from "@nestjs/swagger";
import { Users } from "../entities/user.entitiy";

export class Sign_inDto extends PickType(Users, ["password", "email"]) {}

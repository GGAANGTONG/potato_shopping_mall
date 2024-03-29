import { PickType } from "@nestjs/swagger";
import { Users } from "../entities/user.entitiy";

export class updateDto extends PickType(Users, [
  "nickname",
  "profile",
  "password",
]) {}

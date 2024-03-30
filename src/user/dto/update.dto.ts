import { PickType } from "@nestjs/swagger";
import { Users } from "../entities/user.entitiy";

export class UpdateDto extends PickType(Users, [
  "nickname",
  "profile",
  "password",
]) {}

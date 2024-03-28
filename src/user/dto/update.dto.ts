import { PickType } from "@nestjs/swagger";
import { Users } from "../entities/user.entitiy";

export class SignUpDto extends PickType(Users, [
  "name",
  "password",
  "email",
  "nickname",
  "profile",
]) {}

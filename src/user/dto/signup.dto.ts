<<<<<<< HEAD
import { PickType } from "@nestjs/swagger";
import { Users } from "../entities/user.entitiy";


export class SignUpDto extends PickType(Users, ['id', 'name', 'password', 'email', 'nickname', 'profile', 'role']) {
  
}
=======
// import { PickType } from "@nestjs/swagger";
// import {  Users } from "../entities/user.entitiy";

// export class SignUpDto extends PickType(Users, ['id', 'name', 'password', 'email', 'nickname', 'profile', 'role']) {

// }
>>>>>>> 2197c9cb86321b0198c4d0dd8abdee7d0d1c6289

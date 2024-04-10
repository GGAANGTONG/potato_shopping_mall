import { PickType } from "@nestjs/swagger";
import { Boards } from "../entities/boards.entity";


export class CreateBoardDto extends PickType(Boards, ['title', 'content']) {}

import { PickType } from "@nestjs/swagger";
import { Comments } from "../entities/comments.entity";

export class CreateCommentDto extends PickType(Comments, ['board_id', 'content']) {}

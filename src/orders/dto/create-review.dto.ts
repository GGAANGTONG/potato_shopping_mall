
import { IsString } from "class-validator";


export class CreateReviewDto {


    @IsString()
    stars: string;

    @IsString()
    review: string;
}

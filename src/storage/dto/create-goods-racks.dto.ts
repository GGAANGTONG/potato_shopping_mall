import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class AddGoodsToRackDto {
  @IsNotEmpty({ message: '랙 ID는 필수값입니다.' })
  @IsNumber({}, { message: '랙 ID는 숫자여야 합니다.' })
  rack_id: number;

  @IsNotEmpty({ message: '상품 ID는 필수값입니다.' })
  @IsNumber({}, { message: '상품 ID는 숫자여야 합니다.' })
  goods_id: number;

  @IsNotEmpty({ message: '적재 수량은 필수값입니다.' })
  @IsNumber({}, { message: '적재 수량은 숫자여야 합니다.' })
  @Min(1, { message: '적재 수량은 최소 1개 이상이어야 합니다.' })
  quantity: number;
}

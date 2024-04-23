import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Racks } from '../../storage/entities/rack.entity';
import { IsNumber, IsPositive } from 'class-validator';

@Entity({ name: 'stocks' })
export class Stocks {
  @IsNumber()
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber({}, { message: '상품 id는 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '상품 id는 양수로 입력되어야 합니다.' })
  @Column({ type: 'int' })
  goods_id: number;

  @IsNumber()
  @IsNumber({}, { message: '재고 수량은 숫자 형식으로 입력되어야 합니다.' })
  @IsPositive({ message: '재고 수량은 양수로 입력되어야 합니다.' })
  @Column({ type: 'int' })
  count: number; // 창고에 저장된 상품의 수량

  @ManyToOne(() => Racks, (rack) => rack.stock)
  @JoinColumn({ name: 'rack_id' })
  rack: Racks;
}

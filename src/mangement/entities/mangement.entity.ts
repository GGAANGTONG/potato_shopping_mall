import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { IsEnum, IsNumber, IsPositive, IsString } from 'class-validator';

  
  @Entity({ name: 'mangement' })
  export class Mangement {
    @IsNumber()
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;
  
    @IsNumber({}, { message: '상품 id는 숫자 형식으로 입력되어야 합니다.' })
    @IsPositive({ message: '상품 id는 양수로 입력되어야 합니다.' })
    @Column({ type: 'int' })
    goods_id: number;


    @IsNumber({}, { message: '상품 id는 숫자 형식으로 입력되어야 합니다.' })
    @IsPositive({ message: '상품 id는 양수로 입력되어야 합니다.' })
    @Column({ type: 'int' })
    racks_id: number;

    @IsNumber({}, { message: '상품 id는 숫자 형식으로 입력되어야 합니다.' })
    @IsPositive({ message: '상품 id는 양수로 입력되어야 합니다.' })
    @Column({ type: 'int' })
    stock_id: number;

    @IsNumber({}, { message: '상품 id는 숫자 형식으로 입력되어야 합니다.' })
    @IsPositive({ message: '상품 id는 양수로 입력되어야 합니다.' })
    @Column({ type: 'int' })
    storage_id: number;
  
    @IsNumber()
    @IsNumber({}, { message: '재고 수량은 숫자 형식으로 입력되어야 합니다.' })
    @IsPositive({ message: '재고 수량은 양수로 입력되어야 합니다.' })
    @Column({ type: 'int' })
    count: number; 

    @IsString()
    @Column({ type: 'varchar', length: 100 })
    g_name: string;


    @IsString()
    @Column({ type: 'varchar', length: 100 })
    m_name: string;
    

   
  }
  
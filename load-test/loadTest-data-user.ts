import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Boards } from '../src/boards/entities/boards.entity';
import { Comments } from '../src/boards/entities/comments.entity';
import { Categories } from '../src/goods/entities/categories.entity';
import { Goods } from '../src/goods/entities/goods.entity';
import { Stocks } from '../src/goods/entities/stocks.entity';
import { Carts } from '../src/orders/entities/carts.entity';
import { Orders } from '../src/orders/entities/orders.entity';
import { Payments } from '../src/payments/entities/payments.entity';
import { Point } from '../src/point/entities/point.entity';
import { Users } from '../src/user/entities/user.entitiy';
import { OrdersDetails } from '../src/orders/entities/ordersdetails.entity';
import { Reviews } from '../src/orders/entities/review.entity';
import { Like } from '../src/like/entities/like.entity';
import dotenv from 'dotenv'
import { Racks } from '../src/storage/entities/rack.entity'
import { Storage } from '../src/storage/entities/storage.entity';
import { JwtService } from '@nestjs/jwt';
import fs from 'fs';

dotenv.config()

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users, Point, Payments, Orders, Reviews, OrdersDetails, Orders, Carts, Like, Stocks, Goods, Categories, Comments, Boards, Racks, Storage],
  synchronize: true,
  logging: false,
});

const arrayRole = [0, 1]
const arrayGrade = [0, 1, 2]

//원하는 수 만큼 넣으세요.
const count = 0;
const jwtService = new JwtService()
const JWT_ACCESS_TOKEN_SECRET = 'adkjfadjfdasjfasdf'
async function createDummyData() {
  const data = [];
  //oauth랑 user랑 합치고, user에 이렇게 남겨놓으면 될듯?
  await AppDataSource.initialize()
    .then(
      async() => {
        //유저
        for(let i = 0; i < count; i++) {
          const id = i + 1
          const email = faker.internet.email()
          const nickname = faker.internet.userName()
          const profile = faker.image.url({
            width: 400,
            height: 400
          })
          const randomIndexRole = Math.floor(Math.random() * arrayRole.length)
          const randomIndexGrade = Math.floor(Math.random() * arrayGrade.length) 
          const role = randomIndexRole
          const grade = randomIndexGrade
          const points = 1000000
          const bank = faker.number.int(10)

          //DB 입력
          const user = new Users()
          
          user.email = email
          user.nickname = nickname
          user.profile = profile
          user.role = role
          user.grade = grade
          user.points = points
          user.bank = bank
          await AppDataSource.manager.save(user)

          //csv 파일 생성
          const payload = {email, sub: id}
          const csv = {
            accessToken: `Bearer ${jwtService.sign(payload, {
              secret: JWT_ACCESS_TOKEN_SECRET
            })}`
          }
          data.push(csv)
    }
    const filename = 'fake_data_user.csv'
    const csvData = data.map(csv => `${csv.accessToken}`).join('\n');
    fs.writeFileSync(filename, `accessToken\n${csvData}`);
  }
    ).catch(error => console.error(error))
}

createDummyData()
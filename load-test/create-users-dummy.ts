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

async function createDummyData() {

  //oauth랑 user랑 합치고, user에 이렇게 남겨놓으면 될듯?
  await AppDataSource.initialize()
    .then(
      async() => {
        //유저
        for(let i = 0; i < count; i++) {

          const randomIndexRole = Math.floor(Math.random() * arrayRole.length)
          const randomIndexGrade = Math.floor(Math.random() * arrayGrade.length) 

          const user = new Users()
          //얘만 sns에서 받아와서 인증하고
          user.email = faker.internet.email()
          //나머지는 직접 입력
          user.nickname = faker.internet.userName()
          user.profile = faker.image.url({
            width: 400,
            height: 400
          })
          user.role = randomIndexRole
          user.grade = randomIndexGrade
          user.points = 1000000
          user.bank = +faker.random.numeric(10)
          await AppDataSource.manager.save(user)
    }
  }
    ).catch(error => console.error(error))
}

createDummyData()
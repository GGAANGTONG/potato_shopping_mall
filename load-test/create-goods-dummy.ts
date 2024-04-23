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
import { Oauth } from '../src/oauth/entities/oauth.entity';

dotenv.config()

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users, Point, Payments, Orders, Reviews, OrdersDetails, Orders, Carts, Like, Stocks, Goods, Categories, Comments, Boards, Racks, Storage, Oauth],
  synchronize: true,
  logging: false,
});

function randomFloat(min:number, max:number) {
  return Math.random() * (max - min + 0.1) + min
}

const count_storage = 10
const count_rack = 5
const count_category = 5
const count_goods = 100
const count_stock = 3

async function createDummyData() {

  await AppDataSource.initialize()
    .then(
      async() => {
        //물류창고
        for(let i = 0; i < count_storage; i++) {
          const storage = new Storage()
          storage.name = faker.location.street()
          storage.address = faker.location.city()
          storage.postal_code = faker.location.zipCode()
          storage.contact_name = faker.person.fullName()
          storage.contact_phone = faker.phone.number('###-####-####')
          storage.is_available = true

          // for(let i = 0; i < count_rack; i++) {
          //   const rack = new Racks()
          //   rack.name = 
          //   rack.location_info = 

          //   rack.storage = storage
          // }
        }

        //카테고리
        for(let i = 0; i < count_category; i++) {
          const category = new Categories()
          category.c_name = faker.commerce.product()
          category.c_desc = faker.commerce.productDescription()
          await AppDataSource.manager.save(category)
        
        //상품
        for(let i = 0; i < count_goods; i++) {
        const goods = new Goods()
        goods.g_name = faker.commerce.productName()
        goods.g_desc = faker.commerce.productDescription()
        goods.g_img = faker.image.url({
          width: 400, 
          height: 400
        })
        goods.g_option = faker.commerce.productMaterial()
        goods.discount_rate = +randomFloat(0.1, 1).toFixed(2)
        goods.cost_price = +faker.commerce.price()
        goods.g_price = goods.cost_price * goods.discount_rate
        
        goods.category = category

        await AppDataSource.manager.save(goods)

        //재고
        for(let i = 0; i < count_stock; i++) {
          const stock = new Stocks()
          stock.count = +faker.string.numeric()
          
          await AppDataSource.manager.save(stock)
        }
      }
    }
  }
    ).catch(error => console.error(error))
}

createDummyData()
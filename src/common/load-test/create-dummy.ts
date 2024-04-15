import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Boards } from '../../boards/entities/boards.entity';
import { Comments } from '../../boards/entities/comments.entity';
import { Categories } from '../../goods/entities/categories.entity';
import { Goods } from '../../goods/entities/goods.entity';
import { Stocks } from '../../goods/entities/stocks.entity';
import { Carts } from '../../orders/entities/carts.entity';
import { Orders } from '../../orders/entities/orders.entity';
import { Payments } from '../../payments/entities/payments.entity';
import { Point } from '../../point/entities/point.entity';
import { Users } from '../../user/entities/user.entitiy';
import { OrdersDetails } from 'src/orders/entities/ordersdetails.entity';
import { Reviews } from '../../orders/entities/review.entity';
import { Like } from '../../like/entities/like.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Users, Point, Payments, Orders, Reviews, OrdersDetails, Orders, Carts, Like, Stocks, Goods, Categories, Comments, Boards ],
  synchronize: true,
  logging: false,
});

function randomFloat(min, max) {
  return Math.random() * (max - min + 0.1) + min
}

async function createDummyData() {

  await AppDataSource.initialize()
    .then(

      async() => {
        //카테고리
        for(let i = 0; i < 5; i++) {
          const category = new Categories()
          category.c_name = faker.commerce.product()
          category.c_desc = faker.commerce.productDescription()
          await AppDataSource.manager.save(category)
        
        //상품
        for(let i = 0; i < 100; i++) {
        const goods = new Goods()
        goods.g_name = faker.commerce.productName()
        goods.g_desc = faker.commerce.productDescription()
        goods.g_img = faker.image.imageUrl(400, 400)
        goods.g_option = faker.commerce.productMaterial()
        goods.discount_rate = randomFloat(0.1, 1)
        goods.cost_price = +faker.commerce.price()
        goods.g_price = goods.cost_price * goods.discount_rate
        
        goods.category = category

        await AppDataSource.manager.save(goods)

        //재고
        for(let i = 0; i < 1; i++) {
          const stock = new Stocks()
          stock.count = +faker.random.numeric()
          
          stock.goods = goods
        
          await AppDataSource.manager.save(stock)
        }
      }
    }
  }
    ).catch(error => console.error(error))
}

createDummyData()
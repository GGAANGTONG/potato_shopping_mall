import { faker } from '@faker-js/faker';
import fs from 'fs';
import _ from 'lodash';

//createOrderDto
//req
//orderId
//

function randomFloat(min:number, max:number) {
  return Math.random() * (max - min + 0.1) + min
}

function generateFakeData(numRows: number) {
    const data = [];

    for(let i = 0; i < numRows; i++) {
      const order = {
        req: {
          user: i + 1,
          roles: randomFloat(0, 1),
          grade: randomFloat(0, 2)
        },
      createOrderDto: {
        carts_id: i + 1
      },
      orderId: i + 1
        }
        data.push(order)
      }
      return data
    }

function writeToCSV(filename: string, numRows: number): void {
    const data = generateFakeData(numRows);
    const csvData = data.map(order => `${JSON.stringify(order.createOrderDto)}, ${JSON.stringify(order.req)}, ${order.orderId}`).join('\n');
    fs.writeFileSync(filename, `createOrderDto, req, orderId\n${csvData}`);
}

const NUM_ROWS = 100;
const FILENAME = 'fake_data_orders.csv';

writeToCSV(FILENAME, NUM_ROWS);


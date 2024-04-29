import { faker } from '@faker-js/faker';
import fs from 'fs';
import _ from 'lodash';

function generateFakeData(numRows: number) {
    const data = [];

    for(let i = 0; i < numRows; i++) {
      const order = {
      createOrderDtoCarts_id1: `[${i + 1}, ${i + 2}, ${i + 3}]`,
      orderId: i + 1
        }
        data.push(order)
      }
      return data
    }

function writeToCSV(filename: string, numRows: number): void {
    const data = generateFakeData(numRows);
    const csvData = data.map(order => `${order.createOrderDtoCarts_id1}, ${order.orderId}`).join('\n');
    fs.writeFileSync(filename, `createOrderDtoCarts_id1, orderId\n${csvData}`);
}

const NUM_ROWS = 500;
const FILENAME = 'fake_data_orders.csv';

writeToCSV(FILENAME, NUM_ROWS);


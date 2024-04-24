import { faker } from '@faker-js/faker';
import fs from 'fs';
import _ from 'lodash';

//paymentId
//createPaymentDto = {order_id: faker.number.int()}


function generateFakeData(numRows: number) {
    const data = [];

    for(let i = 0; i < numRows; i++) {
      const order = {
      createPaymentDtoOrder_id: i + 1,
      paymentId: i + 1
        }
        data.push(order)
      }
      return data
    }

function writeToCSV(filename: string, numRows: number): void {
    const data = generateFakeData(numRows);
    const csvData = data.map(payment => `${payment.createPaymentDtoOrder_id}, ${payment.paymentId}`).join('\n');
    fs.writeFileSync(filename, `createPaymentDto, paymentId\n${csvData}`);
}

const NUM_ROWS = 500;
const FILENAME = 'fake_data_payments.csv';

writeToCSV(FILENAME, NUM_ROWS);


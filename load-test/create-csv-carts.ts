import fs from 'fs';
import { faker } from '@faker-js/faker';

function generateFakeData(numRows: number) {
    const data = [];
    for(let i = 0; i < numRows; i++) {
      const cart = {
      cartId: i + 1,
      goodsId: i + 1,
      //createCartDto
      createCartDtoCtCount: faker.number.int({ min: 1, max: 20 }),
      updateCount: faker.number.int({ min: 1, max: 20 }),
  }
    data.push(cart)
  }
  return data;
    }
  
function writeToCSV(filename: string, numRows: number): void {
    const data = generateFakeData(numRows);
    const csvData = data.map(cart => `${cart.cartId},${cart.goodsId},${cart.createCartDtoCtCount}, ${cart.updateCount}`).join('\n');
    fs.writeFileSync(filename, `cartId, goodsId, createCartDtoCtCount, updateCount\n${csvData}`);
}

const NUM_ROWS = 500;
const FILENAME = 'fake_data_cart.csv';

writeToCSV(FILENAME, NUM_ROWS);


  //   function writeToCSV(filename: string, numRows: number): void {
  //     const data = generateFakeData(numRows);
  //     const headers = "cartId, goodsId, CreateCartDtoCtCount, userId, userRoles, req.grade, updateCount";
  //     const csvRows = [];
  //     let counter = 1;
  //     for (const cart of data) {
  //         const rows = [
  //             `${cart.cartId}, cartId${counter}`,
  //             `${cart.goodsId}, goodsId${counter}`,
  //             `${cart.createCartDtoCtCount}, createCartDtoCtCount${counter}`,
  //             `${cart.userId}, userId${counter}`,
  //             `${cart.userRoles}, userRoles${counter}`,
  //             `${cart.userGrade}, userGrade${counter}`,
  //             `${cart.updateCount}, updateCount${counter}`
  //         ];
  //         csvRows.push(rows.join('\n'));
  //         counter++
  //     }
  //     const csvData = `${headers}\n${csvRows.join('\n')}`;
  //     fs.writeFileSync(filename, csvData);
  // }
import fs from 'fs';

function generateFakeData(numRows: number) {
    const data = [];

    for(let i = 0; i < numRows; i++) {
      const goods = {
      goodsId: i + 1,
    }
    data.push(goods)
  }
    return data
  }

  


function writeToCSV(filename: string, numRows: number): void {
    const data = generateFakeData(numRows);
    const csvData = data.map(goods => `${goods.goodsId}`).join('\n');
    fs.writeFileSync(filename, `goodsId\n${csvData}`);
}

const NUM_ROWS = 500;
const FILENAME = 'fake_data_goods.csv';

writeToCSV(FILENAME, NUM_ROWS);


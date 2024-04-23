import { faker } from '@faker-js/faker';
import fs from 'fs';
import _ from 'lodash';

function generateFakeData(numRows: number) {
    const data = [];

    for(let i = 0; i < numRows; i++) {
      const oauth = {
      socialUser: {
        email: faker.internet.email()
      },
      res: {
        send: ['Body'],
        status: () => {
          return oauth
        },
        render: ['url'],
        json: {},
        end: (data) => {
          if(_.isNil(data)) {
            return undefined
          }
          return data
        }
      }
    }
    data.push(oauth)
  }

    return data
  }

  


function writeToCSV(filename: string, numRows: number): void {
    const data = generateFakeData(numRows);
    const csvData = data.map(oauth => `${JSON.stringify(oauth.socialUser)}, ${JSON.stringify(oauth.res)}`).join('\n');
    fs.writeFileSync(filename, `socialUser, res\n${csvData}`);
}

const NUM_ROWS = 100;
const FILENAME = 'fake_data_oauth.csv';

writeToCSV(FILENAME, NUM_ROWS);


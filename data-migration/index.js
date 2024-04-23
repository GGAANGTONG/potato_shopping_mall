import AWS from 'aws-sdk';
import mysql from 'mysql2/promise';
import { Client } from '@opensearch-project/opensearch';

AWS.config.update({ region: 'ap-northeast-2' });

const ssm = new AWS.SSM();

export const handler = async (event) => {
  const lastMigrationTime = await getLastMigrationTime();

  const sqlConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const esClient = new Client({
    nodes: [process.env.OPENSEARCH_ENDPOINT],
    auth: {
      username: process.env.OPENSEARCH_USERNAME,
      password: process.env.OPENSEARCH_PASSWORD,
    },
  });

  try {
    const query = `SELECT * FROM goods WHERE updated_at > ?`;
    const [rows] = await sqlConnection.execute(query, [lastMigrationTime]);
    console.log('Processing records since: ' + lastMigrationTime);
  
    for (const row of rows) {
      const document = {
        id: row.id,
        name: row.g_name,
        price: row.g_price,
        description: row.g_desc,
        image: row.g_img,
        option: row.g_option,
        discountRate: row.discount_rate,
        costPrice: row.cost_price || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
  
      await esClient.index({
        index: 'goods_index',
        id: row.id.toString(),
        body: document,
      });
    }
  
    console.log(`${rows.length} records indexed.`);
    await updateLastMigrationTime(new Date().toISOString());
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await sqlConnection.end();
  }
};

async function getLastMigrationTime() {
  const params = {
    Name: 'LastMigrationTime',
    WithDecryption: false
  };
  const data = await ssm.getParameter(params).promise();
  return data.Parameter ? data.Parameter.Value : '1970-01-01T00:00:00Z';
}

async function updateLastMigrationTime(timestamp) {
  const params = {
    Name: 'LastMigrationTime',
    Type: 'String',
    Value: timestamp,
    Overwrite: true
  };
  await ssm.putParameter(params).promise();
}

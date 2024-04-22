// elasticsearch.service.ts
import { Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      node: 'https://search-potato-elastic-search-xf4b3i5akrizfst6jnoxvsdimy.ap-northeast-2.es.amazonaws.com',
      auth: {
        username: 'potato-ElasticSearch-king',
        password: 'Potatomaster1!'  
      },
      ssl: {
        rejectUnauthorized: false 
      }
    });
  }

  async search(index: string, query: any) {
    return this.client.search({
      index,
      body: query,
    });
  }

  async checkConnection() {
    try {
      const result = await this.client.info();
      console.log('Connection to OpenSearch successful:', result);
    } catch (error) {
      console.error('Connection to OpenSearch failed:', error);
    }
  }
}

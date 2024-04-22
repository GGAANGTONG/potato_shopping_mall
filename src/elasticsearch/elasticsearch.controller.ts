import { Controller, Get } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';

@Controller('elastic-search')
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Get('/check-es-connection')
  checkElasticsearchConnection() {
    return this.elasticsearchService.checkConnection();
  }
}
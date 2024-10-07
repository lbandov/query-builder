import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(private readonly elasticsearchService: NestElasticsearchService) {}

  async indexDocument(index: string, document: any) {
    return this.elasticsearchService.index({
      index,
      body: document,
    });
  }

  async search(index: string, query: any) {
    return this.elasticsearchService.search({
      index,
      body: query,
    });
  }
}
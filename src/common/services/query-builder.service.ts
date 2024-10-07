import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { QUERY_FIELD_METADATA } from '../decorators/query-field.decorator';
import { SORTABLE_METADATA } from '../decorators/sortable.decorator';

@Injectable()
export class QueryBuilderService {
  constructor(
    private prisma: PrismaService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async executeQuery(model: string, dto: any, useElasticsearch: boolean = false) {
    const queryFields = Reflect.getMetadata(QUERY_FIELD_METADATA, dto.constructor) || [];
    const sortableFields = Reflect.getMetadata(SORTABLE_METADATA, dto.constructor) || [];

    if (useElasticsearch) {
      return this.executeElasticsearchQuery(model, dto, queryFields, sortableFields);
    } else {
      return this.executePrismaQuery(model, dto, queryFields, sortableFields);
    }
  }

  private async executePrismaQuery(model: string, dto: any, queryFields: any[], sortableFields: string[]) {
    const where = {};
    const orderBy = {};

    queryFields.forEach(({ field, operation }) => {
      if (dto[field] !== undefined) {
        where[field] = this.getPrismaOperation(operation, dto[field]);
      }
    });

    if (dto.sortBy && sortableFields.includes(dto.sortBy)) {
      orderBy[dto.sortBy] = dto.sortOrder || 'asc';
    }

    return this.prisma[model].findMany({
      where,
      orderBy,
      skip: dto.skip,
      take: dto.take,
    });
  }

  private getPrismaOperation(operation: string, value: any) {
    switch (operation) {
      case 'eq': return { equals: value };
      case 'gt': return { gt: value };
      case 'lt': return { lt: value };
      case 'gte': return { gte: value };
      case 'lte': return { lte: value };
      case 'contains': return { contains: value };
      case 'in': return { in: value };
      default: return value;
    }
  }

  private async executeElasticsearchQuery(model: string, dto: any, queryFields: any[], sortableFields: string[]) {
    const must = [];

    queryFields.forEach(({ field, operation }) => {
      if (dto[field] !== undefined) {
        must.push(this.getElasticsearchOperation(field, operation, dto[field]));
      }
    });

    const body: any = {
      query: {
        bool: { must },
      },
    };

    if (dto.sortBy && sortableFields.includes(dto.sortBy)) {
      body.sort = [{ [dto.sortBy]: { order: dto.sortOrder || 'asc' } }];
    }

    if (dto.skip !== undefined) {
      body.from = dto.skip;
    }

    if (dto.take !== undefined) {
      body.size = dto.take;
    }

    const result = await this.elasticsearchService.search({
      index: model,
      body,
    });

    return result.hits.hits.map(hit => hit._source);
  }

  private getElasticsearchOperation(field: string, operation: string, value: any) {
    switch (operation) {
      case 'eq': return { term: { [field]: value } };
      case 'gt': return { range: { [field]: { gt: value } } };
      case 'lt': return { range: { [field]: { lt: value } } };
      case 'gte': return { range: { [field]: { gte: value } } };
      case 'lte': return { range: { [field]: { lte: value } } };
      case 'contains': return { match: { [field]: value } };
      case 'in': return { terms: { [field]: value } };
      default: return { term: { [field]: value } };
    }
  }
}

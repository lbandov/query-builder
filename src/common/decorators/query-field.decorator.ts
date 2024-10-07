import { SetMetadata } from '@nestjs/common';

export const QUERY_FIELD_METADATA = 'queryField';

export interface QueryFieldOptions {
  field: string;
  operation?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
}

export const QueryField = (options: QueryFieldOptions): PropertyDecorator => {
    return SetMetadata(QUERY_FIELD_METADATA, options);
  };
import { SetMetadata } from '@nestjs/common';

export const SORTABLE_METADATA = 'sortable';

export const Sortable = (fields: string[]) => SetMetadata(SORTABLE_METADATA, fields);

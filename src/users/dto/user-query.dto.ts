import { IsOptional, IsString, IsEmail } from 'class-validator';
import { BaseQueryDto } from '../../common/dtos/base-query.dto';
import { QueryField } from '../../common/decorators/query-field.decorator';
import { Sortable } from '../../common/decorators/sortable.decorator';

@Sortable(['name', 'email', 'createdAt'])
export class UserQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  @QueryField({ field: 'name', operation: 'contains' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @QueryField({ field: 'email', operation: 'eq' })
  email?: string;
}
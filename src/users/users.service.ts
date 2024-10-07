import { Injectable } from '@nestjs/common';
import { QueryBuilderService } from '../common/services/query-builder.service';
import { UserQueryDto } from './dto/user-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly queryBuilderService: QueryBuilderService) {}

  async findAll(query: UserQueryDto) {
    return this.queryBuilderService.executeQuery('user', query);
  }
}
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { QueryBuilderService } from '../common/services/query-builder.service';
import { SearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [SearchModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, QueryBuilderService],
})
export class UsersModule {}
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCategoriesQuery } from './queries/get-categories.query';

@Injectable()
export class CategoriesService {
  constructor(private readonly queryBus: QueryBus) {}
  findAll() {
    return this.queryBus.execute(new GetCategoriesQuery());
  }
}

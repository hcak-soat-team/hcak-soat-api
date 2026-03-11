import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoriesQuery } from './get-categories.query';
import { CategoryReadModel } from '../../domain/read-models/category.read-model';
import { CategoryRepository } from '../ports/categories.repository';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesQueryHandler
  implements IQueryHandler<GetCategoriesQuery, CategoryReadModel[]>
{
  constructor(
    private readonly categoriesRepository: CategoryRepository,
  ) {}

  async execute() {
    return this.categoriesRepository.findAll();
  }
}

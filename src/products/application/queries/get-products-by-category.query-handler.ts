import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsByCategoryQuery } from './get-products-by-category.query';
import { ProductReadModel } from '../../domain/read-models/product.read-model';
import { ProductRepository } from '../ports/product.repository';
import { Logger } from '@nestjs/common';

@QueryHandler(GetProductsByCategoryQuery)
export class GetProductsByCategoryQueryHandler
  implements IQueryHandler<GetProductsByCategoryQuery, ProductReadModel[]>
{
  private readonly logger = new Logger(GetProductsByCategoryQueryHandler.name);

  constructor(private readonly productsRepository: ProductRepository) {}

  async execute(query: GetProductsByCategoryQuery) {
    this.logger.debug(
      `Getting products by category ${query.categoryId}: ${JSON.stringify(query)}`,
    );

    return this.productsRepository.findByCategory(query.categoryId);
  }
} 
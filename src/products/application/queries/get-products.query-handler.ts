import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from './get-products.query';
import { ProductReadModel } from '../../domain/read-models/product.read-model';
import { ProductRepository } from '../ports/product.repository';
import { Logger } from '@nestjs/common';

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler
  implements IQueryHandler<GetProductsQuery, ProductReadModel[]>
{
  private readonly logger = new Logger(GetProductsQueryHandler.name);

  constructor(private readonly productsRepository: ProductRepository) {}

  async execute(query: GetProductsQuery) {
    this.logger.debug(
      `Getting products: ${JSON.stringify(query)}`,
    );

    return this.productsRepository.findAll();
  }
}

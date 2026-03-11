import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from './get-product.query';
import { ProductReadModel } from '../../domain/read-models/product.read-model';
import { ProductRepository } from '../ports/product.repository';
import { Logger, NotFoundException } from '@nestjs/common';

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler
  implements IQueryHandler<GetProductQuery, ProductReadModel>
{
  private readonly logger = new Logger(GetProductQueryHandler.name);
  constructor(private readonly productsRepository: ProductRepository) {}

  async execute(query: GetProductQuery): Promise<ProductReadModel> {
    this.logger.debug(
      `Getting product with id ${query.id}: ${JSON.stringify(query)}`,
    );

    const product = await this.productsRepository.findById(query.id);
    if (!product) {
      throw new NotFoundException(`Product with id ${query.id} not found`);
    }
    return product;
  }
} 
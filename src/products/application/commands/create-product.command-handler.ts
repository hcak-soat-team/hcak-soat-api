import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { Logger, NotFoundException } from '@nestjs/common';
import { ProductFactory } from 'src/products/domain/factories/product.factory';
import { ProductRepository } from '../ports/product.repository';
import { CategoryRepository } from 'src/categories/application/ports/categories.repository';
import { CategoryNotFoundException } from 'src/categories/domain/category.errors';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler
  implements ICommandHandler<CreateProductCommand>
{
  private readonly logger = new Logger(CreateProductCommandHandler.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productFactory: ProductFactory,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<string> {
    this.logger.debug(
      `Processing "CreateProductCommand": ${JSON.stringify(command)}`,
    );

    try {
      await this.categoryRepository.findById(command.categoryId);
    } catch (err) {
      if (err instanceof CategoryNotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }

    const product = this.productFactory.create(
      command.name,
      command.description,
      command.price,
      command.categoryId,
      command.stock,
      command.image
    );
    const savedProduct = await this.productRepository.save(product);
    return savedProduct.id;
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { ProductRepository } from '../ports/product.repository';
import { Logger, NotFoundException } from '@nestjs/common';
import { ProductStock } from 'src/products/domain/value-objects/product-stock';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler
  implements ICommandHandler<UpdateProductCommand>
{
  private readonly logger = new Logger(UpdateProductCommand.name);

  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<string> {
    const product = await this.productRepository.findById(command.id);

    if (!product) {
      throw new NotFoundException(`Product with id ${command.id} not found`);
    }

    if (command.data.name) {
      product.changeName(command.data.name);
    }
    if (command.data.description) {
      product.changeDescription(command.data.description);
    }

    if (command.data.price) {
      product.changePrice(command.data.price);
    }
    if (command.data.categoryId) {
      product.changeCategoryId(command.data.categoryId);
    }
    if (command.data.stock) {
      product.changeStock(new ProductStock(command.data.stock));
    }

    this.logger.debug(
      `Updating product with id ${command.id}: ${JSON.stringify(product)}`,
    );

    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct.id;
  }
}

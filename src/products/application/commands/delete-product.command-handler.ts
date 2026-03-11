import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { ProductRepository } from '../ports/product.repository';
import { Logger, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler
  implements ICommandHandler<DeleteProductCommand>
{
  private readonly logger = new Logger(DeleteProductCommandHandler.name);

  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const product = await this.productRepository.findById(command.id);
    if (!product) {
      throw new NotFoundException(`Product with id ${command.id} not found`);
    }

    this.logger.debug(
      `Deleting product with id ${command.id}: ${JSON.stringify(product)}`,
    );

    await this.productRepository.delete(command.id);
  }
}

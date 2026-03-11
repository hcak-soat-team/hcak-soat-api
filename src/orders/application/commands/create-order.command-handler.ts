import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { ProductRepository } from 'src/products/application/ports/product.repository';
import { OrderFactory } from 'src/orders/domain/factories/order.factory';
import { CustomerRepository } from 'src/customers/application/ports/customer.repository';
import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CategoryRepository } from 'src/categories/application/ports/categories.repository';
import { OrderRepository } from '../ports/order.repository';
@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  private readonly logger = new Logger(CreateOrderCommandHandler.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderFactory: OrderFactory,
    private readonly customerRepository: CustomerRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(command: CreateOrderCommand) {
    this.logger.debug(
      `Processing "CreateOrderCommand": ${JSON.stringify(command)}`,
    );

    if (!command.items?.length) {
      throw new BadRequestException('O pedido deve ter pelo menos um item');
    }

    if (command.customerId) {
      const customer = await this.customerRepository.findById(
        command.customerId,
      );

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
    }

    const products = await this.productRepository.findManyByIds(
      command.items.map((item) => item.productId),
    );

    const productIds = command.items.map((item) => item.productId);
    const foundIds = new Set(products.map((p) => p.id));
    const missing = productIds.filter((id) => !foundIds.has(id));

    if (missing.length > 0) {
      throw new NotFoundException(`Produtos não encontrados: ${missing.join(', ')}`);
    }

    const categoryIds = [...new Set(products.map((p) => p.categoryId))];
    const categories = await this.categoryRepository.findManyByIds(categoryIds);
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const productMap = new Map(products.map((p) => [p.id, p]));

    const itemData = command.items.map(({ productId, quantity }) => {
      const product = productMap.get(productId);
      if (!product) {
        throw new NotFoundException(`Produto não encontrado: ${productId}`);
      }

      const categoryName = categoryMap.get(product.categoryId);
      if (!categoryName) {
        throw new NotFoundException(`Categoria não encontrada para o produto ${productId}`);
      }

      return { product, quantity, categoryName };
    });

    const order = this.orderFactory.create(command.customerId, itemData);

    const newOrder = await this.orderRepository.save(order);

    await this.orderRepository.refreshReadModel();

    return newOrder.id;
  }
}

import { UpdateOrderStatusCommand } from './update-order-status.command';
import { OrderRepository } from '../ports/order.repository';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateOrderStatusCommand)
export class UpdateOrderStatusCommandHandler
  implements ICommandHandler<UpdateOrderStatusCommand>
{
  private readonly logger = new Logger(UpdateOrderStatusCommandHandler.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: UpdateOrderStatusCommand) {
    this.logger.debug(
      `Processing "UpdateOrderStatusCommand": ${JSON.stringify(command)}`,
    );

    const order = await this.orderRepository.findById(command.orderId);
    if (!order) {
      throw new NotFoundException(`Order with id ${command.orderId} not found`);
    }

    try {
      switch (command.status) {
        case 'preparing':
          order.prepare();
          break;
        case 'ready':
          order.finalize();
          break;
        case 'finished':
          order.deliver();
          break;
        default:
          throw new BadRequestException('Status não encontrado');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.orderRepository.save(order);
    await this.orderRepository.refreshReadModel();
  }
}

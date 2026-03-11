import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { DeleteCustomerCommand } from './delete-customer.command';
import { CustomerRepository } from '../ports/customer.repository';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerCommandHandler
  implements ICommandHandler<DeleteCustomerCommand>
{
  private readonly logger = new Logger(DeleteCustomerCommandHandler.name);

  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findById(command.id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${command.id} not found`);
    }

    this.logger.debug(
      `Deleting customer with id ${command.id}: ${JSON.stringify(customer)}`,
    );

    await this.customerRepository.delete(command.id);
  }
}

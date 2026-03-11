import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CustomerFactory } from 'src/customers/domain/factories/customer.factory';
import { CustomerRepository } from '../ports/customer.repository';
import { CreateCustomerCommand } from './create-customer.command';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerCommandHandler
  implements ICommandHandler<CreateCustomerCommand>
{
  private readonly logger = new Logger(CreateCustomerCommandHandler.name);

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerFactory: CustomerFactory,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<string> {
    this.logger.debug(
      `Processing "CreateCustomerCommand": ${JSON.stringify(command)}`,    );

    const customer = this.customerFactory.create(
      command.name,
      command.email,
      command.cpf
    );
    const savedCustomer = await this.customerRepository.save(customer);
    return savedCustomer.id;
  }
}

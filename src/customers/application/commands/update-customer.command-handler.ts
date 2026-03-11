import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { UpdateCustomerCommand } from './update-customer.command';
import { CustomerRepository } from '../ports/customer.repository';
import { CustomerFactory } from 'src/customers/domain/factories/customer.factory';


@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerCommandHandler
  implements ICommandHandler<UpdateCustomerCommand>
{
  private readonly logger = new Logger(UpdateCustomerCommand.name);

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerFactory: CustomerFactory,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<string> {
    const existingCustomer = await this.customerRepository.findById(command.id);
    const updatedCustomer = command.data;
    
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with id ${command.id} not found`);
    }

    if (updatedCustomer.name) {
        existingCustomer.updateName(updatedCustomer.name);
    }
    if (updatedCustomer.email) {
        existingCustomer.updateEmail(updatedCustomer.email);
    }
    if (updatedCustomer.cpf) {
        existingCustomer.updateCpf(updatedCustomer.cpf);
    }
    
    this.logger.debug(
      `Updating customer with CPF ${updatedCustomer.cpf}: ${JSON.stringify(updatedCustomer)}`,
    );

    const savedCustomer = await this.customerRepository.save(existingCustomer);
    return savedCustomer.id;
  }
} 
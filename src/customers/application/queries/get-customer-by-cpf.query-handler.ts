import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { GetCustomerByCpfQuery } from './get-customer-by-cpf.query';
import { CustomerReadModel } from 'src/customers/domain/read-models/customer.read-model';
import { CustomerRepository } from '../ports/customer.repository';

@QueryHandler(GetCustomerByCpfQuery)
export class GetCustomerByCpfQueryHandler
  implements IQueryHandler<GetCustomerByCpfQuery, CustomerReadModel>
{
  private readonly logger = new Logger(GetCustomerByCpfQueryHandler.name);

  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(query: GetCustomerByCpfQuery): Promise<CustomerReadModel> {
    this.logger.debug(
      `Getting customer with CPF ${query.cpf}: ${JSON.stringify(query)}`,
    );

    const customer = await this.customerRepository.findByCpf(query.cpf);
    if (!customer) {
      throw new NotFoundException(`Customer with CPF ${query.cpf} not found`);
    }
    return customer;
  }
} 
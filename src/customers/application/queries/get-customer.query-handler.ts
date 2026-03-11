import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';
import { GetCustomerQuery } from 'src/customers/application/queries/get-customer.query';
import { CustomerReadModel } from 'src/customers/domain/read-models/customer.read-model';
import { CustomerRepository } from 'src/customers/application/ports/customer.repository';

@QueryHandler(GetCustomerQuery)
export class GetCustomerQueryHandler
  implements IQueryHandler<GetCustomerQuery, CustomerReadModel>
{
  private readonly logger = new Logger(GetCustomerQueryHandler.name);
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(query: GetCustomerQuery): Promise<CustomerReadModel> {
    this.logger.debug(
      `Getting customer with id ${query.id}: ${JSON.stringify(query)}`,
    );

    const customer = await this.customerRepository.findById(query.id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${query.id} not found`);
    }
    return customer;
  }
}
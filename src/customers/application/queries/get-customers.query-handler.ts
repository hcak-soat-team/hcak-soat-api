import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomersQuery } from './get-customers.query';
import { CustomerReadModel } from 'src/customers/domain/read-models/customer.read-model';
import { CustomerRepository } from '../ports/customer.repository';

@QueryHandler(GetCustomersQuery)
export class GetCustomersQueryHandler implements IQueryHandler<GetCustomersQuery, CustomerReadModel[]> {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(): Promise<CustomerReadModel[]> {
    return this.customerRepository.findAll();
  }
} 
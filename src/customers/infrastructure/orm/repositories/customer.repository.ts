import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepository } from 'src/customers/application/ports/customer.repository';
import { CustomerReadModel } from 'src/customers/domain/read-models/customer.read-model';
import { CustomerMapper } from '../mappers/customer.mapper';
import { Customer } from 'src/customers/domain/customer';
import { CustomerEntity } from '../entities/customer.entity';

@Injectable()
export class OrmCustomerRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
  private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async save(customer: Customer): Promise<Customer> {
    const customerEntity = CustomerMapper.toPersistence(customer)
    const newEntity = await this.customerRepository.save(customerEntity);
    return CustomerMapper.toDomain(newEntity);
  }


  async findById(id: string): Promise<Customer | null> {
    const entity = await this.customerRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    return CustomerMapper.toDomain(entity);
  }

  async findByCpf(cpf: string): Promise<CustomerReadModel | null> {
    const entity = await this.customerRepository.findOne({ 
      where: { cpf: cpf } 
    });
    if (!entity) {
      return null;
    }
    return CustomerMapper.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }

  async findAll(): Promise<CustomerReadModel[]> {
    const entities = await this.customerRepository.find();
    return entities.map(entity => CustomerMapper.toDomain(entity));
  }
}

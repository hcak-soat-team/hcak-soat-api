import { Customer } from 'src/customers/domain/customer';
import { CustomerReadModel } from 'src/customers/domain/read-models/customer.read-model';
export abstract class CustomerRepository {
    abstract save(customer: Customer): Promise<Customer>
    abstract findByCpf(cpf: string): Promise<CustomerReadModel | null>
    abstract findById(id: string): Promise<Customer | null>
    abstract delete (id: string): Promise<void>
    abstract findAll(): Promise<CustomerReadModel[]>
}
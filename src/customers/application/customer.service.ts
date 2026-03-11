import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateCustomerCommand } from './commands/update-customer.command';
import { GetCustomerByCpfQuery } from './queries/get-customer-by-cpf.query';
import { GetCustomerQuery } from './queries/get-customer.query';
import { CreateCustomerCommand } from './commands/create-customer.command';
import { DeleteCustomerCommand } from './commands/delete-customer.command';
import { GetCustomersQuery } from './queries/get-customers.query';

@Injectable()
export class CustomerService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  create(createCustomerCommand: CreateCustomerCommand) {
    return this.commandBus.execute(createCustomerCommand);
  }

  findOne(id: string) {
    return this.queryBus.execute(new GetCustomerQuery(id));
  }

  findByCpf(cpf: string) {
    return this.queryBus.execute(new GetCustomerByCpfQuery(cpf));
  }

  update(command: UpdateCustomerCommand) {
    return this.commandBus.execute(command);
  }

  remove(id: string) {
    return this.commandBus.execute(new DeleteCustomerCommand(id));
  }

  findAll() {
    return this.queryBus.execute(new GetCustomersQuery());
  }
}

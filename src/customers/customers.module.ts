import { Module } from '@nestjs/common';
import { CustomerService } from './application/customer.service';
import { CustomerController } from './presenters/http/customer.controller';
import { GetCustomerQueryHandler } from './application/queries/get-customer.query-handler';
import { GetCustomerByCpfQueryHandler } from './application/queries/get-customer-by-cpf.query-handler';
import { CreateCustomerCommandHandler } from './application/commands/create-customer.command-handler';
import { CustomerFactory } from './domain/factories/customer.factory';
import { UpdateCustomerCommandHandler } from './application/commands/update-customer.command-handler';
import { DeleteCustomerCommandHandler } from './application/commands/delete-customer.command-handler';
import { CustomerInfrastructureModule } from './infrastructure/customer-infrastructure.module';
import { GetCustomersQueryHandler } from './application/queries/get-customers.query-handler';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerFactory,
    CreateCustomerCommandHandler, 
    GetCustomerQueryHandler, 
    GetCustomerByCpfQueryHandler,
    UpdateCustomerCommandHandler,
    DeleteCustomerCommandHandler,
    GetCustomersQueryHandler
  ],
  imports: [CustomerInfrastructureModule],
  exports: [CustomerInfrastructureModule],
})
export class CustomersModule {}

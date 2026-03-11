import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "./entities/customer.entity";
import { CustomerRepository } from "src/customers/application/ports/customer.repository";
import { OrmCustomerRepository } from "./repositories/customer.repository";

@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity])],
    providers: [
        {
            provide: CustomerRepository,
            useClass: OrmCustomerRepository,
        }
    ],
    exports: [CustomerRepository]
})
export class OrmCustomerPersistenceModule {}
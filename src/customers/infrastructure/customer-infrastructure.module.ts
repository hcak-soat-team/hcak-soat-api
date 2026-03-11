import { Module } from "@nestjs/common";
import { OrmCustomerPersistenceModule } from "./orm/orm-persistence.module";

@Module({
  imports: [OrmCustomerPersistenceModule],
  exports: [OrmCustomerPersistenceModule],
})
export class CustomerInfrastructureModule {}

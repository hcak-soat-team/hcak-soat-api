import { Module } from "@nestjs/common";
import { OrmProductPersistenceModule } from "./orm/orm-persistence.module";

@Module({
  imports: [OrmProductPersistenceModule],
  exports: [OrmProductPersistenceModule],
})
export class ProductsInfrastructureModule {}

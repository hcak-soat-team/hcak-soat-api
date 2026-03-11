import { Module } from "@nestjs/common";
import { OrmCategoriesPersistenceModule } from "./persistence/orm-persistence.module";

@Module({
  imports: [OrmCategoriesPersistenceModule],
  exports: [OrmCategoriesPersistenceModule],
})
export class CategoriesInfrastructureModule {}

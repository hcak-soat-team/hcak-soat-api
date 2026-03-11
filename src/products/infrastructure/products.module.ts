import { Module } from '@nestjs/common';
import { OrmCategoriesPersistenceModule } from 'src/categories/infrastructure/persistence/orm/orm-categories-persistence.module';

@Module({
  imports: [OrmCategoriesPersistenceModule],
  // ... outros providers e controllers
})
export class ProductsModule {} 
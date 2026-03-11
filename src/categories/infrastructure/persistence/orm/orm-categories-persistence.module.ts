import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { OrmCategoryRepository } from './repositories/category.repository';
import { CategoryRepository } from 'src/categories/application/ports/categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: CategoryRepository,
      useClass: OrmCategoryRepository,
    },
  ],
  exports: [OrmCategoryRepository],
})
export class OrmCategoriesPersistenceModule {} 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './orm/entities/category.entity';
import { OrmCategoryRepository } from './orm/repositories/category.repository';
import { CategoryRepository } from 'src/categories/application/ports/categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: CategoryRepository,
      useClass: OrmCategoryRepository,
    },
  ],
  exports: [CategoryRepository],
})
export class OrmCategoriesPersistenceModule {}

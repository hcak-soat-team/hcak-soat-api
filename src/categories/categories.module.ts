import { Module } from '@nestjs/common';
import { CategoriesService } from './application/categories.service';
import { CategoriesController } from './presenters/http/categories.controller';
import { GetCategoriesQueryHandler } from './application/queries/get-categories.query-handler';
import { CategoriesInfrastructureModule } from './infrastructure/categories-infrastructure.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, GetCategoriesQueryHandler],
  imports: [CategoriesInfrastructureModule],
  exports: [CategoriesInfrastructureModule]
})
export class CategoriesModule {}

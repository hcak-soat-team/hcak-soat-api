import { Module } from '@nestjs/common';
import { ProductsService } from './application/products.service';
import { ProductsController } from './presenters/http/products.controller';
import { ProductFactory } from './domain/factories/product.factory';
import { CreateProductCommandHandler } from './application/commands/create-product.command-handler';
import { ProductsInfrastructureModule } from './infrastructure/persistence/products-infrastructure.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { GetProductsQueryHandler } from './application/queries/get-products.query-handler';
import { GetProductQueryHandler } from './application/queries/get-product.query-handler';
import { UpdateProductCommandHandler } from './application/commands/update-product.command-handler';
import { DeleteProductCommandHandler } from './application/commands/delete-product.command-handler';
import { GetProductsByCategoryQueryHandler } from './application/queries/get-products-by-category.query-handler';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    ProductFactory, 
    CreateProductCommandHandler,
    GetProductsQueryHandler,
    GetProductQueryHandler,
    UpdateProductCommandHandler,
    DeleteProductCommandHandler,
    GetProductsByCategoryQueryHandler
  ],
  imports: [ProductsInfrastructureModule, CategoriesModule],
  exports: [ProductsInfrastructureModule],
})
export class ProductsModule {}

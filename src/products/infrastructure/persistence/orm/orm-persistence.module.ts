import { Module } from "@nestjs/common";
import { ProductEntity } from "./entities/product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductRepository } from "src/products/application/ports/product.repository";
import { OrmProductRepository } from "./repositories/product.repository";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity])],
    providers: [
        {
            provide: ProductRepository,
            useClass: OrmProductRepository,
        }
    ],
    exports: [ProductRepository]
})
export class OrmProductPersistenceModule {}
import { Product } from "src/products/domain/product";
import { ProductReadModel } from "src/products/domain/read-models/product.read-model";
export abstract class ProductRepository {
    abstract save(product: Product): Promise<Product>
    abstract findAll(): Promise<ProductReadModel[]>
    abstract findById(id: string): Promise<Product | null>
    abstract delete(id: string): Promise<void>
    abstract findByCategory(categoryId: string): Promise<ProductReadModel[]>
    abstract findManyByIds(ids: string[]): Promise<Product[]>
}
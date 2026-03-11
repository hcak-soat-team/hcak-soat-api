import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/products/application/ports/product.repository';
import { Product } from 'src/products/domain/product';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductEntity } from '../entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReadModel } from 'src/products/domain/read-models/product.read-model';

@Injectable()
export class OrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
  private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const productEntity = ProductMapper.toPersistence(product);
    const newEntity = await this.productRepository.save(productEntity);
    return ProductMapper.toDomain(newEntity);
  }

  async findAll(): Promise<ProductReadModel[]> {
    const entities = await this.productRepository.find();
    return entities.map(ProductMapper.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.productRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    return ProductMapper.toDomain(entity);
  }

  async findByCategory(categoryId: string): Promise<ProductReadModel[]> {
    const entities = await this.productRepository.find({ 
      where: { category_id: categoryId } 
    });
    return entities.map(ProductMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const entities = await this.productRepository.find({ where: { id: In(ids) } });
    return entities.map(ProductMapper.toDomain);
  }
}

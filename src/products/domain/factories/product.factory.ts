import { Injectable } from '@nestjs/common';
import { Product } from '../product';
import { ProductStock } from '../value-objects/product-stock';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductFactory {
  create(
    name: string,
    description: string,
    price: number,
    categoryId: string,
    stock: number,
    image: string,
  ): Product {
    const stockVO = new ProductStock(stock);
    const now = new Date();

    return new Product(
      randomUUID(),
      name,
      description,
      price,
      categoryId,
      stockVO,
      image,
      now,
      now
    );
  }
}

import { Injectable } from '@nestjs/common';
import { Order } from '../order';
import { OrderStatus } from '../value-objects/order-status';
import { randomUUID } from 'crypto';
import { Product } from 'src/products/domain/product';
import { OrderItem } from '../order-item';

@Injectable()
export class OrderFactory {
  create(
    customerId: string | undefined,
    items: Array<{ product: Product; quantity: number; categoryName: string }>,
  ) {
    const id = randomUUID();
    const order = new Order(id);
    order.customerId = customerId ?? null;
    order.status = new OrderStatus('pending');
    
    const orderItems = items.map(
      (item) =>
        new OrderItem(
          randomUUID(),
          item.product.id,
          item.product.name,
          item.product.description,
          item.product.price,
          item.quantity,
          item.categoryName,
        ),
    );
    order.items = orderItems;
    return order;
  }
}

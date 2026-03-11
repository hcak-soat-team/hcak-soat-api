import { Order } from 'src/orders/domain/order';
import { OrderEntity } from '../entities/order.entity';
import { OrderStatus } from 'src/orders/domain/value-objects/order-status';
import { OrderItem } from 'src/orders/domain/order-item';
import { OrderItemEntity } from '../entities/order-item.entity';

export class OrderMapper {
  static toDomain(orderEntity: OrderEntity) {
    const orderStatus = new OrderStatus(
      orderEntity.status as
        | 'pending'
        | 'received'
        | 'preparing'
        | 'ready'
        | 'finished',
    );
    const orderModel = new Order(orderEntity.id);
    orderModel.status = orderStatus;
    orderModel.customerId = orderEntity.customerId;
    orderModel.transactionCode = orderEntity.transactionCode || null;
    orderModel.paidAt = orderEntity.paidAt;
    orderModel.amountPaid = orderEntity.amountPaid;
    orderModel.items = orderEntity.items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.productId,
          item.productName,
          item.productDescription,
          Number(item.unitPrice),
          item.quantity,
          item.categoryName,
        ),
    );
    return orderModel;
  }

  static toPersistence(order: Order) {
    const entity = new OrderEntity();
    entity.id = order.id;
    entity.status = order.status.value;
    entity.customerId = order.customerId || null;
    entity.amountPaid = order.amountPaid || null;
    entity.transactionCode = order.transactionCode || '';
    entity.paidAt = order.paidAt || null;
    entity.items = order.items.map((item) => {
      const orderItemEntity = new OrderItemEntity();
      orderItemEntity.id = item.id;
      orderItemEntity.productId = item.productId;
      orderItemEntity.productName = item.productName;
      orderItemEntity.productDescription = item.productDescription;
      orderItemEntity.unitPrice = item.unitPrice;
      orderItemEntity.quantity = item.quantity;
      orderItemEntity.categoryName = item.categoryName;
      orderItemEntity.orderId = order.id;
      orderItemEntity.order = entity;
      return orderItemEntity;
    });

    return entity;
  }
}

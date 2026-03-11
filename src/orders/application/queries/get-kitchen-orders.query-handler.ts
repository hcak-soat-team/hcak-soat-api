import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetKitchenOrdersQuery } from './get-kitchen-orders.query';
import { OrderReadRepository } from '../ports/order-read.repository';
import { OrderReadModel } from 'src/orders/domain/read-models/order.read-model';

@QueryHandler(GetKitchenOrdersQuery)
export class GetKitchenOrdersQueryHandler implements IQueryHandler<GetKitchenOrdersQuery> {
  constructor(private readonly orderReadRepository: OrderReadRepository) {}

  async execute(): Promise<OrderReadModel[]> {
    return this.orderReadRepository.findKitchenOrders();
  }
}

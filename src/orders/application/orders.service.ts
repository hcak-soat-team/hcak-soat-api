import { Injectable } from '@nestjs/common';
import { CreateOrderCommand } from './commands/create-order.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetOrdersQuery } from './queries/get-orders.query';
import { GetOrderQuery } from './queries/get-order.query';
import { GetOrderPaymentQrcodeQuery } from './queries/get-order.payment-qrcode';
import { UpdateOrderStatusCommand } from './commands/update-order-status.command';
import { GetKitchenOrdersQuery } from './queries/get-kitchen-orders.query';

@Injectable()
export class OrdersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  create(createOrderCommand: CreateOrderCommand) {
    return this.commandBus.execute(createOrderCommand);
  }

  findAll(getOrdersQuery: GetOrdersQuery) {
    return this.queryBus.execute(getOrdersQuery);
  }

  findOne(id: string) {
    return this.queryBus.execute(new GetOrderQuery(id));
  }

  generatePaymentQrcode(id: string) {
    return this.queryBus.execute(new GetOrderPaymentQrcodeQuery(id));
  }

  getKitchenOrders() {
    return this.queryBus.execute(new GetKitchenOrdersQuery());
  }

  prepareOrder(updateOrderStatusCommand: UpdateOrderStatusCommand) {
    return this.commandBus.execute(updateOrderStatusCommand);
  }

  finalizeOrder(updateOrderStatusCommand: UpdateOrderStatusCommand) {
    return this.commandBus.execute(updateOrderStatusCommand);
  }

  deliverOrder(updateOrderStatusCommand: UpdateOrderStatusCommand) {
    return this.commandBus.execute(updateOrderStatusCommand);
  }
}

import { OrderReadModel } from "src/orders/domain/read-models/order.read-model";
import { GetOrdersQuery } from "../queries/get-orders.query";

export abstract class OrderReadRepository {
  abstract findAll(getOrdersQuery: GetOrdersQuery): Promise<OrderReadModel[]>;
  abstract findById(id: string): Promise<OrderReadModel | null>;
  abstract findKitchenOrders(): Promise<OrderReadModel[]>;
}
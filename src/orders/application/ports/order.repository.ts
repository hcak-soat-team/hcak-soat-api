import { Order } from "src/orders/domain/order";

export abstract class OrderRepository {
    abstract save(order: Order): Promise<Order>;
    abstract refreshReadModel(): Promise<void>;
    abstract findById(id: string): Promise<Order | null>;
}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { OrderItemEntity } from "./entities/order-item.entity";
import { OrderRepository } from "src/orders/application/ports/order.repository";
import { OrmOrderRepository } from "./repositories/order.repository";
import { OrderReadRepository } from "src/orders/application/ports/order-read.repository";
import { OrmOrderReadyRepository } from "./repositories/order-read.repository.ts";
import { OrderSummaryView } from "./views/order-summary.view";

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, OrderSummaryView])],
    providers: [
        {
            provide: OrderRepository,
            useClass: OrmOrderRepository,
        },
        {
            provide: OrderReadRepository,
            useClass: OrmOrderReadyRepository,
        }
    ],
    exports: [OrderRepository, OrderReadRepository]
})
export class OrmOrderPersistenceModule {}
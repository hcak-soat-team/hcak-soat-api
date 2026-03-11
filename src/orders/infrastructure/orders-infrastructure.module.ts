import { Module } from '@nestjs/common';
import { OrmOrderPersistenceModule } from './persistence/orm/orm-persistence.module';
import { GatewayMercadoPagoModule } from '../../common/infrastructure/gateway/mercadopago/mercado-pago.module';
@Module({
  imports: [OrmOrderPersistenceModule, GatewayMercadoPagoModule],
  exports: [OrmOrderPersistenceModule, GatewayMercadoPagoModule],
})
export class OrdersInfrastructureModule {}

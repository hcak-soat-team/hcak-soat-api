import { Module } from '@nestjs/common';
import { WebhookService } from './application/webhook.service';
import { WebhookController } from './presenters/http/webhook.controller';
import { ProcessMercadoPagoWebhookCommandHandler } from './application/commands/process-mercadopago-webhook.command-handler';
import { GatewayMercadoPagoModule } from 'src/common/infrastructure/gateway/mercadopago/mercado-pago.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, ProcessMercadoPagoWebhookCommandHandler],
  imports: [GatewayMercadoPagoModule, OrdersModule],
})
export class WebhookModule {}

import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProcessMercadoPagoWebhookCommand } from './process-mercadopago-webhook.command';
import { MercadoPagoPaymentGateway } from 'src/common/infrastructure/gateway/mercadopago/port/mercadopago-payment-gateway.port';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { OrderRepository } from 'src/orders/application/ports/order.repository';
import { PaymentReceivedEvent } from 'src/orders/domain/events/payment-received.event';

@CommandHandler(ProcessMercadoPagoWebhookCommand)
export class ProcessMercadoPagoWebhookCommandHandler
  implements ICommandHandler<ProcessMercadoPagoWebhookCommand>
{
  private readonly logger = new Logger(
    ProcessMercadoPagoWebhookCommandHandler.name,
  );
  constructor(
    private readonly mercadoPagoPaymentGateway: MercadoPagoPaymentGateway,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: ProcessMercadoPagoWebhookCommand) {
    try {
      if (command.type !== 'payment') {
        return;
      }

      this.logger.debug(
        `Processing "ProcessMercadoPagoWebhookCommand": ${JSON.stringify(command)}`,
      );
      const payment = await this.mercadoPagoPaymentGateway.getPayment(command.id);

      if (payment.status === 'approved') {
        this.logger.debug(`Payment approved: ${payment.id}`);

        this.eventBus.publish(
          new PaymentReceivedEvent(
            payment.id.toString(),
            payment.external_reference,
            new Date(payment.date_approved),
            payment.transaction_details.total_paid_amount,
          ),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

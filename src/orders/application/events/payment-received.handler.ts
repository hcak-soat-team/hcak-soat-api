import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentReceivedEvent } from '../../domain/events/payment-received.event';
import { OrderRepository } from '../ports/order.repository';
import { Logger } from '@nestjs/common';

@EventsHandler(PaymentReceivedEvent)
export class PaymentReceivedHandler implements IEventHandler<PaymentReceivedEvent> {
  private readonly logger = new Logger(PaymentReceivedHandler.name);

  constructor(private readonly orderRepository: OrderRepository) {}

  async handle(event: PaymentReceivedEvent) {
    try {
      this.logger.debug(
        `Processing payment received event for order ${event.orderId}`,
      );

      const order = await this.orderRepository.findById(event.orderId);

      if (!order) {
        this.logger.error(`Order ${event.orderId} not found`);
        return;
      }

      order.markAsPaid(
        event.transactionCode,
        event.paidAt,
        event.amountPaid,
      );

      await this.orderRepository.save(order);
      await this.orderRepository.refreshReadModel();

      this.logger.debug(
        `Order ${event.orderId} marked as paid with transaction ${event.transactionCode}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing payment received event: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
} 
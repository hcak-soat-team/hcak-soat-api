import { Injectable, Logger } from '@nestjs/common';
import { ProcessMercadoPagoWebhookCommand } from './commands/process-mercadopago-webhook.command';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly commandBus: CommandBus) {}

  async processWebhookNotification(
    processMercadoPagoWebhookCommand: ProcessMercadoPagoWebhookCommand,
  ) {
    this.logger.debug(
      `Processing "ProcessMercadoPagoWebhookCommand": ${JSON.stringify(
        processMercadoPagoWebhookCommand,
      )}`,
    );
    return this.commandBus.execute(processMercadoPagoWebhookCommand);
  }
}

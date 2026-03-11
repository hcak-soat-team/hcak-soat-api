import { Controller, Post, Body, Query } from '@nestjs/common';
import { WebhookService } from '../../application/webhook.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ProcessMercadoPagoWebhookCommand } from 'src/webhook/application/commands/process-mercadopago-webhook.command';
import { WebhookNotificationQueryDto } from './dto/webhook-notification-query.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/mercadopago')
  @ApiExcludeEndpoint()
  async handleWebhookNotification(
    @Query('data.id') id: string,
    @Query('type') type: string,
  ) {
    return this.webhookService.processWebhookNotification(
      new ProcessMercadoPagoWebhookCommand(id, type),
    );
  }
}

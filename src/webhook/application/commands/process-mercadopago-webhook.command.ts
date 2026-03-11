export class ProcessMercadoPagoWebhookCommand {
  constructor(
    public readonly id: string,
    public readonly type: string
  ) {}
}
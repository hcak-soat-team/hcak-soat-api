export class UpdateOrderStatusCommand {
    constructor(
      public readonly orderId: string,
      public readonly status:  'preparing' | 'ready' | 'finished'
    ) {}
  }
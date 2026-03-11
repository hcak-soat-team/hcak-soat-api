export class CreateOrderCommand {
  constructor(
    public readonly items: Array<{
        productId: string;
        quantity: number;
    }>,
    public readonly customerId?: string,
  ) {}
}

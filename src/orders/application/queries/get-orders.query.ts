export class GetOrdersQuery {
  constructor(
    public readonly paymentStatus?:
      | 'all'
      | 'pending'
      | 'received'
      | 'preparing'
      | 'ready'
      | 'finished',
  ) {}
}
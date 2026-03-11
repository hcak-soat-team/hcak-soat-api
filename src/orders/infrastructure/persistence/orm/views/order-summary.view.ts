import { OrderItemReadModel } from 'src/orders/domain/read-models/order.read-model';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'read_orders_summary',
  expression: '',
})
export class OrderSummaryView {
  @ViewColumn({ name: 'idPedido' })
  idPedido: string;

  @ViewColumn({ name: 'cpfCliente' })
  cpfCliente: string;

  @ViewColumn()
  status: string;

  @ViewColumn({ name: 'criadoEm' })
  criadoEm: Date;

  @ViewColumn({ name: 'pagamento' })
  pagamento: {
    codigoTransacao: string;
    dataPagamento: string;
    totalPago: number;
  };

  @ViewColumn({ name: 'items' })
  items: OrderItemReadModel[];
}

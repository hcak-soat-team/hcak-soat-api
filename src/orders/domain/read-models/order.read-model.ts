import { ApiProperty } from '@nestjs/swagger';

export class PaymentReadModel {
  @ApiProperty({ description: 'Código da transação' })
  codigoTransacao: string;

  @ApiProperty({ description: 'Data do pagamento', type: Date, nullable: true })
  dataPagamento: string;

  @ApiProperty({ description: 'Total pago', type: Number })
  totalPago: number;
}

export class OrderItemReadModel {
  @ApiProperty({ description: 'ID do produto' })
  idProduto: string;

  @ApiProperty({ description: 'Nome do produto' })
  nomeProduto: string;

  @ApiProperty({ description: 'Descrição do produto' })
  descricaoProduto: string;

  @ApiProperty({ description: 'Nome da categoria' })
  categoria: string;

  @ApiProperty({ description: 'Preço unitário', type: Number })
  precoUnitario: number;

  @ApiProperty({ description: 'Quantidade', type: Number })
  quantidade: number;

  @ApiProperty({ description: 'Preço total', type: Number })
  precoTotal: number;
}

export class OrderReadModel {
  @ApiProperty({ description: 'ID do pedido' })
  idPedido: string;

  @ApiProperty({ description: 'CPF do cliente' })
  cpfCliente: string;

  @ApiProperty({ description: 'Status do pedido' })
  status: string;

  @ApiProperty({ description: 'Data de criação', type: Date })
  criadoEm: Date;

  @ApiProperty({ description: 'Informações de pagamento', type: PaymentReadModel })
  pagamento: PaymentReadModel;

  @ApiProperty({ description: 'Itens do pedido', type: [OrderItemReadModel] })
  items: OrderItemReadModel[];
}
  
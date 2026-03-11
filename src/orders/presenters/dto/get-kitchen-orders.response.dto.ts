import { ApiProperty } from '@nestjs/swagger';

export class GetKitchenOrdersResponseDto {
  @ApiProperty({ description: 'ID do pedido' })
  idPedido: string;

  @ApiProperty({ description: 'Status atual do pedido (Recebido, Em preparação, Pronto)' })
  status: string;

  @ApiProperty({ description: 'Data/hora de criação do pedido' })
  criadoEm: Date;

  @ApiProperty({ description: 'Itens do pedido', type: 'array' })
  items: any[];
}

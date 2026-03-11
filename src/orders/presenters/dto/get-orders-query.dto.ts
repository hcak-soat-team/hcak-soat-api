import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum PaymentStatus {
  ALL = 'all',
  PENDING = 'pending',
  RECEIVED = 'received',
  PREPARING = 'preparing',
  READY = 'ready',
  FINISHED = 'finished',
}
export class GetOrdersQueryDto {
  @ApiProperty({
    description: 'Status do pedido:\n' +
      '- all: Lista pedidos em andamento (exclui Finalizados e Pendentes) ordenados por:\n' +
      '  1. Pronto > 2. Em Preparação > 3. Recebido (do mais antigo para o mais novo)\n' +
      '- pending: Apenas pedidos com pagamento pendente\n' +
      '- received: Apenas pedidos recebidos\n' +
      '- preparing: Apenas pedidos em preparação\n' +
      '- ready: Apenas pedidos prontos\n' +
      '- finished: Apenas pedidos finalizados',
    enum: PaymentStatus,
    required: false,
    example: PaymentStatus.ALL,
    default: PaymentStatus.ALL
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
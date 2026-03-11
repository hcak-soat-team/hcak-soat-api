import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderReadRepository } from 'src/orders/application/ports/order-read.repository';
import { OrderReadModel } from 'src/orders/domain/read-models/order.read-model';
import { OrderSummaryView } from '../views/order-summary.view';
import { GetOrdersQuery } from 'src/orders/application/queries/get-orders.query';

@Injectable()
export class OrmOrderReadyRepository implements OrderReadRepository {
  constructor(
    @InjectRepository(OrderSummaryView)
    private readonly orderSummaryView: Repository<OrderReadModel>,
  ) {}

  async findAll(getOrdersQuery: GetOrdersQuery): Promise<OrderReadModel[]> {
    const statusMap: Record<string, string> = {
      pending: 'Pagamento pendente',
      received: 'Recebido',
      preparing: 'Em preparação',
      ready: 'Pronto',
      finished: 'Finalizado',
    };

    const query = this.orderSummaryView.createQueryBuilder('orders');

    if (getOrdersQuery.paymentStatus === 'all') {
      // No 'all': excluir pedidos finalizados E pendentes
      query.where('orders.status NOT IN (:...excludedStatus)', { 
        excludedStatus: [statusMap.finished, statusMap.pending] 
      });

      // Ordenação específica: Pronto > Em preparação > Recebido
      query
        .setParameters({
          readyStatus: statusMap.ready,
          preparingStatus: statusMap.preparing,
          receivedStatus: statusMap.received
        })
        .orderBy(`CASE 
          WHEN orders.status = :readyStatus THEN 1
          WHEN orders.status = :preparingStatus THEN 2
          WHEN orders.status = :receivedStatus THEN 3
          ELSE 4
        END`, 'ASC');
    } else if (getOrdersQuery.paymentStatus) {
      // Para outros filtros: mostrar exatamente o status solicitado
      query.where('orders.status = :status', { 
        status: statusMap[getOrdersQuery.paymentStatus] 
      });
    }

    // Ordenação secundária por data de criação (mais antigos primeiro)
    query.addOrderBy('orders.criadoEm', 'ASC');

    return await query.getMany();
  }

  async findById(id: string): Promise<OrderReadModel | null> {
    return await this.orderSummaryView.findOne({ where: { idPedido: id } });
  }

  async findKitchenOrders(): Promise<OrderReadModel[]> {
    const statusMap: Record<string, string> = {
      pending: 'Pagamento pendente',
      received: 'Recebido',
      preparing: 'Em preparação',
      ready: 'Pronto',
      finished: 'Finalizado',
    };

    const query = this.orderSummaryView.createQueryBuilder('orders');

    // Excluir pedidos finalizados e pendentes
    query.where('orders.status NOT IN (:...excludedStatus)', { 
      excludedStatus: [statusMap.finished, statusMap.pending] 
    });

    // Ordenação específica: Pronto > Em preparação > Recebido
    query
      .setParameters({
        readyStatus: statusMap.ready,
        preparingStatus: statusMap.preparing,
        receivedStatus: statusMap.received
      })
      .orderBy(`CASE 
        WHEN orders.status = :readyStatus THEN 1
        WHEN orders.status = :preparingStatus THEN 2
        WHEN orders.status = :receivedStatus THEN 3
        ELSE 4
      END`, 'ASC')
      // Ordenação secundária por data de criação (mais antigos primeiro)
      .addOrderBy('orders.criadoEm', 'ASC');

    return await query.getMany();
  }
}

import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/orders/application/ports/order.repository';
import { OrderEntity } from '../entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderMapper } from '../mappers/order.mapper';
import { Order } from 'src/orders/domain/order';

@Injectable()
export class OrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(order: Order): Promise<Order> {
    const orderEntity = OrderMapper.toPersistence(order);
    const savedOrder = await this.orderRepository.manager.transaction(async (transactionalEntityManager) => {
      const savedOrder = await transactionalEntityManager.save(OrderEntity, orderEntity);
      return savedOrder;
    });
    return OrderMapper.toDomain(savedOrder);
  }

  async refreshReadModel(): Promise<void> {
    await this.dataSource.query('REFRESH MATERIALIZED VIEW CONCURRENTLY read_orders_summary');
  }

  async findById(id: string): Promise<Order | null> {
    const orderEntity = await this.orderRepository.findOne({ where: { id }, relations: ['items'] });
    return orderEntity ? OrderMapper.toDomain(orderEntity) : null;
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderRepository } from '../ports/order.repository';
import { GetOrderPaymentQrcodeQuery } from './get-order.payment-qrcode';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MercadoPagoPaymentGateway } from '../../../common/infrastructure/gateway/mercadopago/port/mercadopago-payment-gateway.port';
import { OrderStatus } from 'src/orders/domain/value-objects/order-status';

@QueryHandler(GetOrderPaymentQrcodeQuery)
export class GetOrderPaymentQrcodeQueryHandler
  implements IQueryHandler<GetOrderPaymentQrcodeQuery>
{
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly generateQrCode: MercadoPagoPaymentGateway,
  ) {}

  async execute(query: GetOrderPaymentQrcodeQuery) {
    const order = await this.orderRepository.findById(query.id);

    if (!order) {
      throw new NotFoundException(`Order with id ${query.id} not found`);
    }

    if (!order.status.equals(new OrderStatus('pending'))) {
      throw new BadRequestException('Order is not pending');
    }

    return await this.generateQrCode.generateQrCode({
      orderId: order.id,
      totalAmount: order.total,
      items: order.items.map((product) => ({
        category: product.categoryName,
        title: product.productName,
        description: product.productDescription,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalAmount: product.totalPrice,
      })),
    });
  }
}

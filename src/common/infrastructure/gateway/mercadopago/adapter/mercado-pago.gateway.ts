import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { MercadoPagoPaymentGateway, PaymentResponse } from '../port/mercadopago-payment-gateway.port';
import { QrCodePayload, QrCodeResponse } from '../dto/qrcode-payload.dto';

@Injectable()
export class GatewayMercadoPago implements MercadoPagoPaymentGateway {
  private readonly logger = new Logger(GatewayMercadoPago.name);

  constructor(private readonly httpService: HttpService) {}

  async generateQrCode(order: QrCodePayload): Promise<QrCodeResponse> {
    this.logger.log(`Generating QR code for order ${order.orderId}`);

    const { data } = await firstValueFrom(
      this.httpService
        .post<QrCodeResponse>(
          `${process.env.MERCADO_PAGO_API}/instore/orders/qr/seller/collectors/${process.env.MERCADO_PAGO_USER_ID}/pos/${process.env.MERCADO_PAGO_EXTERNAL_POS_ID}/qrs`,
          {
            external_reference: order.orderId,
            notification_url: process.env.NOTIFICATION_URL,
            total_amount: order.totalAmount,
            items: order.items.map((item) => ({
              category: item.category,
              title: item.title,
              description: item.description,
              quantity: item.quantity,
              unit_measure: 'unity',
              unit_price: item.unitPrice,
              total_amount: item.totalAmount,
            })),
            title: 'Pagamento de pedido',
            description: 'Pagamento de pedido',
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new InternalServerErrorException(error.response?.data);
          }),
        ),
    );

    return data;
  }

  async getPayment(id: string): Promise<PaymentResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<PaymentResponse>(
          `${process.env.MERCADO_PAGO_API}/v1/payments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new InternalServerErrorException(error.response?.data);
          }),
        ),
    );
    return data;
  }
}

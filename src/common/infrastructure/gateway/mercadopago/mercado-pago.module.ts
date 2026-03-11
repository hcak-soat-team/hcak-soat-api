import { Module } from "@nestjs/common";
import { MercadoPagoPaymentGateway } from "./port/mercadopago-payment-gateway.port";
import { HttpModule } from "@nestjs/axios";
import { GatewayMercadoPago } from "./adapter/mercado-pago.gateway";

@Module({
    imports: [HttpModule],
    providers: [
        {
            provide: MercadoPagoPaymentGateway,
            useClass: GatewayMercadoPago,
        },
    ],
    exports: [MercadoPagoPaymentGateway]
})
export class GatewayMercadoPagoModule {}
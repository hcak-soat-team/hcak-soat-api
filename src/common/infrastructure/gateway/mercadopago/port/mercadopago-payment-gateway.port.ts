export interface PaymentResponse {
  id: number;
  status: string;
  status_detail: string;
  external_reference: string;
  date_created: string;
  date_approved: string;
  date_last_updated: string;
  date_of_expiration: string | null;
  money_release_date: string;
  money_release_status: string;
  live_mode: boolean;
  currency_id: string;
  description: string;
  operation_type: string;
  collector_id: number;
  installments: number;
  issuer_id: string;
  captured: boolean;
  binary_mode: boolean;
  notification_url: string;
  pos_id: string;
  store_id: string;
  processing_mode: string;
  shipping_amount: number;
  taxes_amount: number;
  transaction_amount: number;
  transaction_amount_refunded: number;
  order: {
    id: string;
    type: string;
  };
  payer: {
    id: string;
  };
  payment_method: {
    id: string;
    issuer_id: string;
    type: string;
  };
  payment_method_id: string;
  payment_type_id: string;
  transaction_details: {
    net_received_amount: number;
    total_paid_amount: number;
    installment_amount: number;
    overpaid_amount: number;
    acquirer_reference: string | null;
    bank_transfer_id: string | null;
    external_resource_url: string | null;
    financial_institution: string | null;
    payable_deferral_period: string | null;
    payment_method_reference_id: string | null;
    transaction_id: string | null;
  };
  point_of_interaction: {
    type: string;
    sub_type: string;
    application_data: {
      name: string | null;
      operating_system: string | null;
      version: string | null;
    };
    business_info: {
      branch: string;
      sub_unit: string;
      unit: string;
    };
    location: {
      source: string;
      state_id: string;
    };
  };
  additional_info: {
    tracking_id: string;
  };
  charges_execution_info: {
    internal_execution: {
      date: string;
      execution_id: string;
    };
  };
}

export interface GenerateQrCodePayload {
  in_store_order_id: string;
  qr_data: string;
}

export abstract class MercadoPagoPaymentGateway {
  abstract generateQrCode(data: {
    orderId: string;
    totalAmount: number;
    items: {
      title: string;
      description: string;
      quantity: number;
      unitPrice: number;
      category: string;
      totalAmount: number;
    }[];
  }): Promise<GenerateQrCodePayload>;

  abstract getPayment(id: string): Promise<PaymentResponse>;
}

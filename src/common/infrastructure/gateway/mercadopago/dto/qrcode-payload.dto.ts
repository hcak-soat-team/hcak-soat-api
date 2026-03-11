export interface QrCodeItemPayload {
  category: string;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface QrCodePayload {
  orderId: string;
  totalAmount: number;
  items: QrCodeItemPayload[];
}

export interface QrCodeResponse {
  in_store_order_id: string;
  qr_data: string;
}

interface ShopOrderNews {
  shop_id: string;
  shop_products: any[];
  shop_discounts?: string[];
  priceRaw: number;
  priceAfterDiscount?: number;
}

interface CheckOutResponse {
  totalPrice: number;
  totalFee: number;
  totalOrder: number;
}

export {
    ShopOrderNews,
    CheckOutResponse
}

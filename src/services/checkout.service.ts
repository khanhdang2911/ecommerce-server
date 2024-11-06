import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import * as cartRepo from "../repositories/cart.repo";
import * as productRepo from "../repositories/product.repo";
import { checkoutReviewValidation } from "../validations/checkout.validation";
import { verifyDiscountCode } from "./discount.service";
import { CheckOutResponse, ShopOrderNews } from "../models/checkout.model";
const checkoutReviewService = async (userId: string, checkoutInfo: any) => {
  const { error } = await checkoutReviewValidation(checkoutInfo);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }

  // Fetch user cart and products from the cart
  const foundCart = await cartRepo.findUserCart(userId);
  const cartProducts = foundCart.cart_products;
  const products = await productRepo.checkAndGetDataFromListProduct(
    cartProducts
  );
  let shop_orders_news: Array<ShopOrderNews> = [];
  const checkoutResponse: CheckOutResponse = {
    totalPrice: 0,
    totalFee: 0,
    totalOrder: 0, //total after adding fees
  };

  for (let shop_order of checkoutInfo.shop_orders) {
    //check if shop is in cart
    const shopFound = foundCart.cart_products.filter(
      (p) => p.product_shop.toString() === shop_order.shop_id
    );
    if (!shopFound) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        "Shop not found, please load cart again!"
      );
    }
    //get products of shop
    const shopProducts = products.filter(
      (p) => p.product_shop === shop_order.shop_id
    );
    // Calculate total price for this shop's products
    const shopTotalPrice = shopProducts.reduce((acc: any, product: any) => {
      return acc + product.product_price * product.product_quantity;
    }, 0);
    checkoutResponse.totalPrice += shopTotalPrice;
    //apply discount (voucher) if any
    let discountVerifiedInfo;
    if (shop_order.shop_discounts.length > 0) {
      discountVerifiedInfo = await verifyDiscountCode(
        {
          discount_code: shop_order.shop_discounts[0],
          discount_shopId: shop_order.shop_id,
          products: shopProducts.map((p: any) => {
            return {
              product_id: p.product_id,
              product_quantity: p.product_quantity,
            };
          }),
        },
        userId
      );
      checkoutResponse.totalPrice -= discountVerifiedInfo.discountValue;
    }
    shop_orders_news.push({
      shop_id: shop_order.shop_id,
      shop_products: shopProducts,
      shop_discounts: shop_order.shop_discounts,
      priceRaw: shopTotalPrice,
      priceAfterDiscount: shopTotalPrice - discountVerifiedInfo?.discountValue!,
    });
  }
  //total Order
  checkoutResponse.totalOrder =
    checkoutResponse.totalPrice + checkoutResponse.totalFee;
  return {
    ...checkoutInfo,
    shop_orders_news,
    checkoutResponse,
  };
};

export { checkoutReviewService };

import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import * as cartRepo from "../repositories/cart.repo";
import * as productRepo from "../repositories/product.repo";
import {
  checkoutReviewValidation,
  orderProductsValidation,
  updateStatusValidation,
} from "../validations/checkout.validation";
import { verifyDiscountCode } from "./discount.service";
import { CheckOutResponse, ShopOrderNews } from "../models/checkout.model";
import { acquireLock, releaseLock } from "./redis.service";
import { Order } from "../models/order.model";
import { ORDER_STATUS } from "../constants/order.constant";
import {
  createOrder,
  findOrderByFilter,
  findOrderById,
  updateOneOrder,
} from "../repositories/checkout.repo";
import { increaseStock } from "./inventory.service";
import { ROLE } from "../constants/common.constant";
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

/*
  orderInfo{
    "checkoutInfo": {
        "cart_id": "60f4e9c3c8e7d4001f5f6f1d",
        "shop_orders": [
            {
                "shop_id": "60f4e9c3c8e7d4001f5f6f1c",
                "shop_discounts": []
            }
        ]
    },
    "user_shipping": {
        "shipping_street": "1234",
        "shipping_city": "HCM",
        "shipping_country": "Vietnam",
        "shipping_state": "pending",
    },
    "user_payment": {
        "payment_method": "paypal",
        "payment_fee": 0
    }
  }
*/
const orderProductsService = async (userId: string, orderInfo: any) => {
  const { error } = await orderProductsValidation(orderInfo);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  const { shop_orders_news, checkoutResponse } = await checkoutReviewService(
    userId,
    orderInfo.checkoutInfo
  );
  const allProducts = shop_orders_news.flatMap((shop_order) => {
    return shop_order.shop_products.map((product) => product);
  });
  for (let product of allProducts) {
    const key = await acquireLock(product.product_id, product.product_quantity);
    if (!key) {
      throw new ErrorResponse(
        StatusCodes.CONFLICT,
        "Some product in your cart is out of stock, please reload cart!"
      );
    }
    await releaseLock(key);
  }
  const order = await createOrder({
    order_userId: userId as any,
    order_checkout: checkoutResponse,
    order_shipping: orderInfo.user_shipping,
    order_payment: orderInfo.user_payment,
    order_products_discounts: shop_orders_news,
    order_status: ORDER_STATUS.PENDING,
  });
  if (!order) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Cannot create order");
  }
  return order;
};

const cancelOrderSerivce = async (userId: object, orderId: string) => {
  const order = await findOrderById(orderId);
  console.log(order);
  if (!order) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Order not found");
  }
  if (userId.toString() !== order.order_userId.toString()) {
    throw new ErrorResponse(
      StatusCodes.FORBIDDEN,
      "You are not allowed to cancel this order"
    );
  }
  if (order.order_status !== ORDER_STATUS.PENDING) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Order is not pending, cannot cancel"
    );
  }
  const allProducts = order.order_products_discounts.flatMap(
    (shop_order: any) => {
      return shop_order.shop_products.map((product) => product);
    }
  );
  for (let product of allProducts) {
    await increaseStock(product.product_id, product.product_quantity);
  }
  const orderCanceled = await updateOneOrder(
    { _id: orderId },
    { order_status: ORDER_STATUS.CANCELLED }
  );
  if (!orderCanceled) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Cannot cancel order");
  }
  return orderCanceled;
};
export { checkoutReviewService, orderProductsService, cancelOrderSerivce };

const getOrderForUserService = async (userId: object, orderId: string) => {
  const order = await findOrderById(orderId);
  if (!order) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Order not found");
  }
  if (userId.toString() !== order.order_userId.toString()) {
    throw new ErrorResponse(
      StatusCodes.FORBIDDEN,
      "You are not allowed to get this order"
    );
  }
  return order;
};

const getAllOrdersForUserService = async (userId: object) => {
  const orders = await findOrderByFilter({ order_userId: userId });
  if (!orders) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Orders not found");
  }
  return orders;
};

const canUpdateOrderStatus = (role: string, orderStatus: string) => {
  if (role === ROLE.SHOP) {
    return (
      orderStatus === ORDER_STATUS.CONFIRMED ||
      orderStatus === ORDER_STATUS.CANCELLED
    );
  }
  return true;
};

const updateOrderStatusService = async (
  orderId: string,
  body: any,
  role: string = "admin"
) => {
  const { error } = await updateStatusValidation(body);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  if (!canUpdateOrderStatus(role, body.order_status)) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, "Access denied xxx");
  }
  const updatedOrder = await updateOneOrder({ _id: orderId }, body);
  if (!updatedOrder) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Cannot update order");
  }
  return updatedOrder;
};

export {
  getOrderForUserService,
  getAllOrdersForUserService,
  updateOrderStatusService,
};

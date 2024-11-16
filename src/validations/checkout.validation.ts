import Joi from "joi";
import { ORDER_STATUS, PAYMENT_METHOD } from "../constants/order.constant";

const checkoutReviewValidation = async (body: object) => {
  const schema = Joi.object({
    cart_id: Joi.string().required().trim().strict(),
    shop_orders: Joi.array()
      .items(
        Joi.object({
          shop_id: Joi.string().required().trim().strict(),
          shop_discounts: Joi.array().items(Joi.string()),
        })
      )
      .required(),
  });
  return await schema.validateAsync(body);
};

const orderProductsValidation = async (body: object) => {
  const schema = Joi.object({
    checkoutInfo: Joi.object({
      cart_id: Joi.string().required().trim().strict(),
      shop_orders: Joi.array()
        .items(
          Joi.object({
            shop_id: Joi.string().required().trim().strict(),
            shop_discounts: Joi.array().items(Joi.string()),
          })
        )
        .required(),
    }),
    user_shipping: Joi.object({
      shipping_street: Joi.string().required().trim().strict(),
      shipping_city: Joi.string().required().trim().strict(),
      shipping_country: Joi.string().required().trim().strict(),
    }),
    user_payment: Joi.object({
      payment_method: Joi.string()
        .valid(...Object.values(PAYMENT_METHOD))
        .required()
        .trim()
        .strict(),
      payment_fee: Joi.number().required(),
    }),
  });
  return await schema.validateAsync(body);
};

const updateStatusValidation = async (body: object) => {
  const schema = Joi.object({
    order_status: Joi.string()
      .valid(...Object.values(ORDER_STATUS))
      .required()
      .trim()
      .strict(),
  });
  return await schema.validateAsync(body);
};
export {
  checkoutReviewValidation,
  orderProductsValidation,
  updateStatusValidation,
};

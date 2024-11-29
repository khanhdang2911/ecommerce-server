import Joi from "joi";
import {
  DISCOUNT_APPLY_TYPE,
  DISCOUNT_TYPE,
} from "../constants/discount.constant";

const discountCreateValidation = async (discountInfo: object) => {
  const validationSchema = Joi.object({
    discount_name: Joi.string().required().trim().strict().min(5).max(50),
    discount_description: Joi.string()
      .required()
      .trim()
      .strict()
      .min(10)
      .max(200),
    discount_type: Joi.string()
      .required()
      .valid(...Object.values(DISCOUNT_TYPE)),
    discount_value: Joi.number().required().min(0),
    discount_code: Joi.string().required().trim().strict(),
    discount_start_date: Joi.date().required().min("now"),
    discount_end_date: Joi.date()
      .required()
      .min(Joi.ref("discount_start_date")),
    discount_apply_count: Joi.number().required().min(1).max(10000),
    discount_max_uses_per_user: Joi.number().required().min(1).max(100),
    discount_min_order_value: Joi.number().required().min(0),
    discount_apply_to: Joi.string()
      .required()
      .valid(...Object.values(DISCOUNT_APPLY_TYPE)),
    discount_specific_products: Joi.array().items(Joi.string()),
  });
  return await validationSchema.validateAsync(discountInfo);
};

const discountUpdateValidation = async (discountInfo: object) => {
  const validationSchema = Joi.object({
    discount_name: Joi.string().trim().strict().min(5).max(50),
    discount_description: Joi.string()

      .trim()
      .strict()
      .min(10)
      .max(200),
    discount_type: Joi.string().valid(...Object.values(DISCOUNT_TYPE)),
    discount_value: Joi.number().min(0),
    discount_code: Joi.string().trim().strict(),
    discount_start_date: Joi.date().min("now"),
    discount_end_date: Joi.date().min(Joi.ref("discount_start_date")),
    discount_apply_count: Joi.number().min(1).max(10000),
    discount_max_uses_per_user: Joi.number().min(1).max(100),
    discount_min_order_value: Joi.number().min(0),
    discount_apply_to: Joi.string().valid(
      ...Object.values(DISCOUNT_APPLY_TYPE)
    ),
    discount_specific_products: Joi.array().items(Joi.string()),
  });
  return await validationSchema.validateAsync(discountInfo);
};

const verifyDiscountCodeValidation = async (discountInfo: object) => {
  const validationSchema = Joi.object({
    discount_code: Joi.string().required().trim().strict(),
    discount_shopId: Joi.string().required().trim().strict(),
    products: Joi.array()
      .required()
      .items(
        Joi.object({
          product_id: Joi.string().required().trim().strict(),
          product_quantity: Joi.number().required().min(1),
        })
      ),
  });
  return await validationSchema.validateAsync(discountInfo);
};
const cancelDiscountValidation = async (discountInfo: object) => {
  const validationSchema = Joi.object({
    discount_code: Joi.string().required().trim().strict(),
    discount_shopId: Joi.string().required().trim().strict(),
  });
  return await validationSchema.validateAsync(discountInfo);
};
export {
  discountCreateValidation,
  discountUpdateValidation,
  verifyDiscountCodeValidation,
  cancelDiscountValidation,
};

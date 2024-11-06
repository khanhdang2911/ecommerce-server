import Joi from "joi";

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

export { checkoutReviewValidation };

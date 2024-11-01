import Joi from "joi";

const addToCardValidation = async (product: Object) => {
  const schema = Joi.object({
    product_id: Joi.string().required().trim().strict(),
    product_quantity: Joi.number().integer().required(),
  });
  return await schema.validateAsync(product);
};

const updateCartValidation = async (body: Object) => {
  const schema = Joi.object({
    product_id: Joi.string().required().trim().strict(),
    product_quantity: Joi.number().integer().required(),
    product_old_quantity: Joi.number().integer().required(),
  });
  return await schema.validateAsync(body);
};
export { addToCardValidation, updateCartValidation };

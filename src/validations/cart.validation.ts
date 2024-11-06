import Joi from "joi";

const addToCardValidation = async (product: object) => {
  const schema = Joi.object({
    product_shop: Joi.string().required().trim().strict(),//shop id
    product_id: Joi.string().required().trim().strict(),
    product_quantity: Joi.number().integer().required(),
  });
  return await schema.validateAsync(product);
};

const updateCartValidation = async (body: object) => {
  const schema = Joi.object({
    product_id: Joi.string().required().trim().strict(),
    product_quantity: Joi.number().integer().required(),
    product_old_quantity: Joi.number().integer().required(),
  });
  return await schema.validateAsync(body);
};

const deleteProductInCartValidation = async (product: object) => {
  const schema = Joi.object({
    product_id: Joi.string().required().trim().strict(),
  });
  return await schema.validateAsync(product);
};
export {
  addToCardValidation,
  updateCartValidation,
  deleteProductInCartValidation,
};

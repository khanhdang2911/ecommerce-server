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

const deleteProductInCartValidation = async(product: Object)=>{
  const schema= Joi.object({
    product_id:Joi.string().required().trim().strict()
  })
  return await schema.validateAsync(product)
}
export { addToCardValidation, updateCartValidation, deleteProductInCartValidation };

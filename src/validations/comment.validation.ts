import Joi from "joi";

const createCommentValidation = async (object: object) => {
  const schema = Joi.object({
    comment_productId: Joi.string().required().trim().strict(),
    comment_content: Joi.string().required().trim().strict(),
    comment_left: Joi.number(),
    comment_right: Joi.number(),
    comment_parentId: Joi.string().trim().strict(),
  });
  return await schema.validateAsync(object);
};

export { createCommentValidation };

import Joi from "joi";

const createResourceValidation = async (object: object) => {
  const schema = Joi.object({
    src_name: Joi.string().required(),
    src_slug: Joi.string().required(),
    src_description: Joi.string().required(),
  });
  return await schema.validateAsync(object);
};

const addRoleGrantValidation = async (object: object) => {
  const schema = Joi.object({
    resource: Joi.string().required(),
    role: Joi.string().required(),
    action: Joi.array().items(Joi.string()).required(),
    attributes: Joi.string().required(),
  });
  return await schema.validateAsync(object);
};

const deleteRoleGrantValidation = async (object: object) => {
  const schema = Joi.object({
    resource: Joi.string().required(),
    role: Joi.string().required(),
    action: Joi.string().required(),
  });
  return await schema.validateAsync(object);
};

export {
  createResourceValidation,
  addRoleGrantValidation,
  deleteRoleGrantValidation,
};

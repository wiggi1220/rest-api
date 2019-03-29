import Joi from "joi";

export const userSchema = Joi.object().keys({
  username: Joi.string()
    .min(2)
    .max(16)
    .required(),
  password: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required()
});
export const updateSchema = Joi.object().keys({
  username: Joi.string()
    .min(2)
    .max(16),
  password: Joi.string(),
  email: Joi.string().email({ minDomainAtoms: 2 })
});

export const loginUser = Joi.alternatives().try(
  Joi.object({
    username: Joi.string()
      .min(2)
      .max(16)
      .required(),
    password: Joi.string().required()
  }),
  Joi.object({
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string().required()
  })
);

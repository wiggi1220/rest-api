import Joi from "joi";

export const messageSchema = Joi.object().keys({
  message: Joi.string()
    .min(1)
    .max(40)
});

export const messagesQuerySchema = Joi.object().keys({
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100),
  last: Joi.boolean()
});

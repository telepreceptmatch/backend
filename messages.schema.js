const Joi = require('joi');

const sendMessageSchema = Joi.object({
  receiver: Joi.number().required(),
  message: Joi.string().max(100).required(),
  read: Joi.boolean(),
});

module.exports = { sendMessageSchema };

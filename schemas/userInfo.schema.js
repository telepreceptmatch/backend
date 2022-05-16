const Joi = require('joi');

const { createUserSchema } = require('./users.schema');

const id = Joi.number();
const userId = Joi.number();
const username = Joi.string();
const firstName = Joi.string();
const lastName = Joi.string();
const location = Joi.string();

const createUserInfoSchema = Joi.object({
  username: username.required(),
  firstName: firstName.required(),
  lastName: lastName.required(),
  location: location.required(),
  user: createUserSchema,
  userId: userId.required(),
});

const getUserInfoSchema = Joi.object({
  id: id.required(),
});

const updateUserInfoSchema = Joi.object({
  firstName: firstName,
  lastName: lastName,
  location: location,
  userId: userId,
});

module.exports = { createUserInfoSchema, getUserInfoSchema, updateUserInfoSchema };

const boom = require('@hapi/boom');

/*
  Middleware that validates the data coming from a request with the given Joi schema

  @param {schema} Joi schema to validate data (look in the schema folder)
  @param {property} string to where the data would be find e.g body, params
*/
function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      next(boom.badRequest(error));
    }
    next()
  }
}

module.exports = validatorHandler;

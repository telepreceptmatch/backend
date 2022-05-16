const { ValidationError } = require('sequelize');

// Middleware to log all of the errors in the console of node
function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

// Middleware to Handle specific sequelize error
function sequelizeErrorHandler(err, req, res, next){
  if( err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors
    }).end()
  }else { next(err) }
  
}

// Middleware to dynamically handle errors
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode)
      .json(output.payload);
  }else{
    next(err)
  }
}

// Middleware to send 500 if the error was not catch by other middleware
function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
}


module.exports = { logErrors, errorHandler, boomErrorHandler, sequelizeErrorHandler }

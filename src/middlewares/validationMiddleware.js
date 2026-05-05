const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    const formattedErrors = {};

    errors.array().forEach(err => {
      formattedErrors[err.path] = err.msg;
    });

    return next({
      status: 400,
      message: "Validation failed",
      errors: formattedErrors
    });
  }

  next();
};
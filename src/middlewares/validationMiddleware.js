const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0]; 

    return next({
      status: 400,
      message: firstError.msg
    });
  }

  next();
};
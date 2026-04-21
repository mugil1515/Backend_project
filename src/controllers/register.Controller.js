const service = require('../services/register.Service');

exports.register = async (req, res, next) => {
  try {
    const response = await service.registerUser(req.body);
    if (!response.success) return next(response);

    res.status(response.status).json(response);
  } catch (err) {
    next(err);
  }
};


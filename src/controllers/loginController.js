const service =require('../services/loginService');

exports.login = async (req, res, next) => {
  try {
    const response = await service.loginUser(req.body);
    if (!response.success) return next(response);

    res.status(response.status).json(response);
  } catch (err) {
    next(err);
  }
};
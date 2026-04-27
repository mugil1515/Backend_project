const userService = require('../services/otp.Service');

exports.sendOTP = async (req, res, next) => {
  try {
    const { identifier } = req.body;

    const result = await userService.sendOTP(identifier);

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message
      });
    }

    return res.status(result.status).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    next(error);
  }
};
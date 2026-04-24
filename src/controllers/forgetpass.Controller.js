const authService = require('../services/forgetpassword.Service');

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return res.status(result.status).json(result);
  } catch (error) {
    next(error); // pass error to global handler
  }
};

// Verify OTP
exports.verifyForgotPasswordOTP = async (req, res, next) => {
  try {
    const result = await authService.verifyForgotPasswordOTP(
      req.body.email,
      req.body.otp
    );
    return res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};
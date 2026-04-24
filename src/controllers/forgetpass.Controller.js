const authService = require('../services/forgetpassword.Service');
exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Verify OTP (Forgot Password)
exports.verifyForgotPasswordOTP = async (req, res) => {
  try {
    const result = await authService.verifyForgotPasswordOTP(
      req.body.email,
      req.body.otp
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

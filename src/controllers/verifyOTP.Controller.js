const otpService = require('../services/verifyOTP.Service');

exports.verifyOTPController = async (req, res, next) => {
  try {
    // ✅ accept BOTH email or identifier
    const identifier = req.body.identifier || req.body.email;
    const otp = req.body.otp;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: "Identifier and OTP are required"
      });
    }

    const result = await otpService.verifyEmailOTP(identifier, otp);

    // ❌ error handling
    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message
      });
    }

    // 🔥 set JWT in cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    // response middleware style
    res.locals.data = {
      success: true,
      message: result.message
    };

    next();

  } catch (error) {
    next(error);
  }
};
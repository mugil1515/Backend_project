const otpService = require('../services/verifyOTP.Service');

exports.verifyOTPController = async (req, res, next) => {
  try {
    const identifier = req.body.identifier || req.body.email;
    const otp = req.body.otp;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "email_is_required"
      });
    }
    if(!otp){
      return res.status(400).json({
        success: false,
        message: "otp_is_required"
      });
    }

    const result = await otpService.verifyEmailOTP(identifier, otp);

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message
      });
    }

    // 🔐 Store refresh token in cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    // 🔑 Send access token + user to frontend
    return res.status(200).json({
      success: true,
      message: result.message,
      accessToken: result.accessToken,
      user: result.user
    });

  } catch (error) {
    next(error);
  }
};
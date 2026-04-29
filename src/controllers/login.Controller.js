const service = require("../services/login.Service");

exports.login = async (req, res, next) => {
  try {
    const response = await service.loginUser(req.body);

    if (!response?.success) {
      return res.status(response?.status || 400).json({
        success: false,
        message: response?.message || "Login failed"
      });
    }

    if (!response.refreshToken || !response.accessToken) {
      return res.status(500).json({
        success: false,
        message: "Token generation failed"
      });
    }

    // Set refresh token cookie
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: false, // true only for HTTPS production
      sameSite: "lax",
      maxAge: 5 * 60 * 1000,
      path: "/"
    });

    console.log("Cookie set successfully");

    return res.status(200).json({
      success: true,
      message: response.message,
      accessToken: response.accessToken,
      user: response.user
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
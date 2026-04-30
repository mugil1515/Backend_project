const service = require("../services/login.Service");

exports.login = async (req, res, next) => {
  try {
    const response = await service.loginUser(req.body);

    if (!response || !response.success) {
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

    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    return res.status(200).json({
      success: true,
      message: response.message,
      accessToken: response.accessToken,
      user: response.user
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
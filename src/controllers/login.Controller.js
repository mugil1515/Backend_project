const service = require("../services/login.Service");

exports.login = async (req, res, next) => {
  try {
    const response = await service.loginUser(req.body);

    if (!response.success) {
      return res.status(response.status).json(response);
    }

    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });
    
    res.json({
      success: true,
      message: response.message,
      accessToken: response.accessToken,
      user: response.user
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
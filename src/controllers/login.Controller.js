// controllers/authController.js

const service = require("../services/login.Service");

exports.login = async (req, res, next) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const response = await service.loginUser(req.body);

    console.log("LOGIN RESPONSE:", response);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.cookie("token", response.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.json({
      success: true,
      message: response.message
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
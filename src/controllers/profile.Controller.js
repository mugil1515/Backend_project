// controllers/userController.js

const repo = require("../repository/userRepository");

exports.getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    // 🔥 REMOVE SENSITIVE FIELDS
    const { password, otp, otp_expiry, ...safeUser } = user;

    res.locals.data = {
      success: true,
      message: "Profile fetched successfully",
      user: safeUser
    };

    next();

  } catch (error) {
    next(error);
  }
};
const repo = require("../repository/userRepository");

exports.getProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "unauthorized_access"
      });
    }

    const user = await repo.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user_not_found"
      });
    }

    // 🔐 remove sensitive data
    const { password, otp, refreshToken, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "profile_fetched",
      user: safeUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal_server_error",
      error: error.message
    });
  }
};
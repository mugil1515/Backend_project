const repo = require("../repository/userRepository");

exports.getProfile = async (req, res, next) => {
  try {
    // 🔥 from middleware (JWT decoded)
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: no user id"
      });
    }

    // 🔥 fetch user from DB via repository
    const user = await repo.findUserById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "Profile fetched successfully",
      user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
const repo = require("../repository/userRepository");

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: no user id"
      });
    }
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
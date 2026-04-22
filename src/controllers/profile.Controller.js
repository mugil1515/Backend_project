// controllers/userController.js

const repo = require("../repository/userRepository");

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // 🔥 from decoded token

    const user = await repo.findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};
const repo = require("../repository/userRepository");

exports.getProfile = async (req, res, next) => {
  try {
    console.log("REQ.USER:", req.user); // 🔥 DEBUG

    const userId = req.user.id; // ✅ ONLY THIS

    const user = await repo.findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};
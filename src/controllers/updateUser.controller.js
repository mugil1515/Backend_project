
const userService = require("../services/updateUser.Service");

exports.updateMyProfile = async (req, res, next) => {

  try {

    const userId = req.user.id; // from authMiddleware

    await userService.updateMyProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (err) {
    next(err);
  }
};
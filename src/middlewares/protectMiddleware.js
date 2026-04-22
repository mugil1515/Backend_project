const jwt = require("jsonwebtoken");
const repo = require("../repository/userRepository");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // 🔥 BLOCK IF NO TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }

    // 🔥 VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    // 🔥 FETCH USER FROM DB
    const user = await repo.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔥 ATTACH USER
    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access"
    });
  }
};
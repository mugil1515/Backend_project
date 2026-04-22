const jwt = require("jsonwebtoken");
const repo = require("../repository/userRepository");

exports.protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FETCH REAL USER FROM DB (IMPORTANT FIX)
    const user = await repo.findUserByEmailOrPhone(decoded.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // ✔ only DB user data goes forward
    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};
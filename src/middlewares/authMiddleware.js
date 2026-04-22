// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    const token = req.cookies.token; // 🔥 read from cookie

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token in cookie"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contains { id, email }

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
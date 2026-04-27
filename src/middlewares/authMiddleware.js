const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token in cookie"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔐 DECODED TOKEN:", decoded);

    req.user = decoded;

    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
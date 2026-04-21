exports.protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token"
    });
  }

  try {
    const jwt = require("jsonwebtoken");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user info

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};
const jwt = require("jsonwebtoken");
const repo = require("../repository/userRepository");

exports.authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "no_token",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "token_expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "invalid_token",
      });
    }

    const user = await repo.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user_not_found",
      });
    }

    req.user = user;

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "server_error",
    });
  }
};
const jwt = require("jsonwebtoken");
const repo = require("../repository/userRepository");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "no_token"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "invalid_token"
      });
    }

    const user = await repo.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "token_expired_or_invalid"
    });
  }
};

const { verifyRefreshToken, generateAccessToken } = require('../utils/tokenUtil');
const repo = require('../repository/userRepository');

exports.refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await repo.findUserById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  return generateAccessToken(user);
};
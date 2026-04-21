const { comparePassword, generateAccessToken } = require('../utils/tokenUtil');
const repo = require('../repository/userRepository');

exports.loginUser = async (data) => {
  const { identifier, password } = data;

  const user = await repo.findUserByEmailOrPhone(identifier);

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "User not found. Please register first."
    };
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return {
      success: false,
      status: 401,
      message: "Invalid Password"
    };
  }

  const accessToken = generateAccessToken({ id: user.id });

  return {
    success: true,
    status: 200,
    message: "Login successful",
    accessToken,
  };
};
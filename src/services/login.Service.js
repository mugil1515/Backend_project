const { comparePassword, generateAccessToken, generateRefreshToken } = require('../utils/tokenUtil');
const repo = require('../repository/userRepository');

exports.loginUser = async (data) => {
  const { identifier, password } = data;

  const user = await repo.findUserByEmailOrPhone(identifier);

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "User not found"
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

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);


  return {
  success: true,
  status: 200,
  message: "Login successful",
  accessToken,
  user: {
    id: user.id,
    email: user.email,
    contactno: user.contactno,
    firstname: user.firstname,
    lastname: user.lastname,
    address: user.address
  }
};
};
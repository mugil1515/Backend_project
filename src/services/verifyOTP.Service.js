const repo = require('../repository/userRepository');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtil');

exports.verifyEmailOTP = async (email, enteredOTP) => {
  const user = await repo.findUserByEmailOrPhone(email);

  if (!user) {
    return { status: 404, success: false, message: "User not found" };
  }

  if (!user.otp) {
    return { status: 400, success: false, message: "otp_not_requested" };
  }

  if (new Date() > new Date(user.otp_expiry)) {
    return { status: 400, success: false, message: "OTP expired" };
  }

  if (user.otp !== enteredOTP) {
    return { status: 400, success: false, message: "Invalid OTP" };
  }

  await repo.saveOTP(user.email, null, null);

  const payload = {
    id: user.id,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    success: true,
    status: 200,
    message: "otp_verified_successfully",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      contactno: user.contactno,
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
      role: user.role
    }
  };
};
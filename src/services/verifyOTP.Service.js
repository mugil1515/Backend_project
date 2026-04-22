const repo = require('../repository/userRepository');
const jwt = require('jsonwebtoken');

exports.verifyEmailOTP = async (email, enteredOTP) => {
  const user = await repo.findUserByEmailOrPhone(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (!user.otp) {
    return { status: 400, message: "OTP not requested" };
  }

  if (new Date() > new Date(user.otp_expiry)) {
    return { status: 400, message: "OTP expired" };
  }

  if (user.otp !== enteredOTP) {
    return { status: 400, message: "Invalid OTP" };
  }

  await repo.updateOTP(user.id, null, null);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    success: true,
    status: 200,
    message: "OTP verified successfully",
    token
  };
};
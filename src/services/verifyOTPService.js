const repo = require('../repository/userRepository');

exports.verifyEmailOTP = async (email, enteredOTP) => {
  const user = await repo.findUserByEmailOrPhone(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (!user.otp) {
    return { status: 400, message: "OTP not requested" };
  }

  // 🔹 Check expiry first (better practice)
  if (new Date() > new Date(user.otp_expiry)) {
    return { status: 400, message: "OTP expired" };
  }

  // 🔹 Check OTP match
  if (user.otp !== enteredOTP) {
    return { status: 400, message: "Invalid OTP" };
  }

  // 🔹 Clear OTP after success
  await repo.updateOTP(user.id, null, null);

  return {
    success: true,
    status: 200,
    message: "OTP verified successfully"
  };
};
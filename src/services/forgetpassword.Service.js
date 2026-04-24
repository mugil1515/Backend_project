const repo = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const { generateOTP, getOTPExpiryTime } = require("../utils/tokenUtil");
const { sendEmail } = require("../services/email.service");
const { otpEmailTemplate } = require("../utils/emailOTPTemplate");

exports.forgotPassword = async (email) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const otp = generateOTP();
  const expiry = getOTPExpiryTime();

  await repo.saveOTP(email, otp, expiry);

  await sendEmail(
    email,
    "Reset Password OTP",
    `Your OTP is ${otp}`,
    otpEmailTemplate(otp)
  );

  return { status: 200, message: "OTP sent successfully" };
};

exports.verifyForgotPasswordOTP = async (email, otp) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (!user.otp) {
    return { status: 400, message: "OTP not requested" };
  }

  if (new Date() > new Date(user.otp_expiry)) {
    return { status: 400, message: "OTP expired" };
  }

  if (user.otp !== otp) {
    return { status: 400, message: "Invalid OTP" };
  }

  // 🔥 clear OTP after success
  await repo.clearOTP(email);

  return {
    status: 200,
    message: "OTP verified. You can now reset password"
  };
};

exports.resetPassword = async ({ email, newPassword, confirmPassword }) => {
  if (newPassword !== confirmPassword) {
    return { status: 400, message: "Passwords do not match" };
  }

  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  // 🔐 prevent same password reuse
  const isSame = await bcrypt.compare(newPassword, user.password);

  if (isSame) {
    return {
      status: 400,
      message: "New password cannot be same as old password"
    };
  }

  // 🔐 hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 🔥 update DB
  await repo.updatePassword(email, hashedPassword);

  return {
    status: 200,
    message: "Password reset successful"
  };
};
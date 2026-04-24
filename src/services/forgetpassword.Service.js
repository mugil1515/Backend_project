const repo = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const { generateOTP, getOTPExpiryTime } = require("../utils/tokenUtil");
const { sendEmail } = require("../services/email.service");
const { otpEmailTemplate } = require("../utils/emailOTPTemplate");

// 🔐 Forgot Password
exports.forgotPassword = async (email) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const otp = generateOTP();
  const expiry = getOTPExpiryTime();

  await repo.saveOTP(email, otp, expiry);

  await sendEmail(email, "Forgot Password OTP", otpEmailTemplate(otp));

  return { status: 200, message: "OTP sent to email" };
};

// 🔐 Verify Forgot Password OTP
exports.verifyForgotPasswordOTP = async (email, otp) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (user.otp !== otp) {
    return { status: 400, message: "Invalid OTP" };
  }

  if (new Date() > user.otp_expiry) {
    return { status: 400, message: "OTP expired" };
  }

  // 🔥 IMPORTANT: invalidate OTP after successful verification
  await repo.clearOTP(email);

  return { status: 200, message: "OTP verified successfully" };
};

exports.resetPassword = async ({ email, newPassword, confirmPassword }) => {
  if (newPassword !== confirmPassword) {
    return { status: 400, message: "Passwords do not match" };
  }

  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  // 🔐 Check if new password is same as old password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    return {
      status: 400,
      message: "New password cannot be same as old password"
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await repo.updatePassword(email, hashedPassword);
  await repo.clearOTP(email);

  return { status: 200, message: "Password reset successful" };
};

// 📧 Send Email Verification OTP
exports.sendEmailVerificationOTP = async (email) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const otp = generateOTP();
  const expiry = getOTPExpiryTime();

  await repo.saveEmailVerificationOTP(email, otp, expiry);

  await sendEmail(email, "Email Verification OTP", otpEmailTemplate(otp));

  return { status: 200, message: "Verification OTP sent" };
};

// 📧 Verify Email OTP
exports.verifyEmailOTP = async (email, otp) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (user.email_verified) {
    return { status: 200, message: "Already verified" };
  }

  if (user.otp !== otp) {
    return { status: 400, message: "Invalid OTP" };
  }

  if (new Date() > user.otp_expiry) {
    return { status: 400, message: "OTP expired" };
  }

  await repo.markEmailVerified(email);

  return { status: 200, message: "Email verified successfully" };
};
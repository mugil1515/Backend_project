const repo = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const { generateOTP, getOTPExpiryTime } = require("../utils/tokenUtil");
const { sendEmail } = require("../services/email.service");
const { otpEmailTemplate } = require("../utils/emailOTPTemplate");

exports.forgotPassword = async (email) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "user_not_found" };
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

  return { status: 200, message: "otp_sent_successfully" };
};

exports.verifyForgotPasswordOTP = async (email, otp) => {
  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "user_not_found" };
  }

  if (!user.otp) {
    return { status: 400, message: "otp_not_requested" };
  }

  if (new Date() > new Date(user.otp_expiry)) {
    return { status: 400, message: "otp_expired" };
  }

  if (user.otp !== otp) {
    return { status: 400, message: "invalid_otp" };
  }

  await repo.clearOTP(email);

  return {
    status: 200,
    message: "otp_verified"
  };
};

exports.resetPassword = async ({ email, newPassword, confirmPassword }) => {
  if (newPassword !== confirmPassword) {
    return { status: 400, message: "passwords_do_not_match" };
  }

  const user = await repo.findUserByEmail(email);

  if (!user) {
    return { status: 404, message: "user_not_found" };
  }

  const isSame = await bcrypt.compare(newPassword, user.password);

  if (isSame) {
    return {
      status: 400,
      message: "new_password_cannot_be_same_as_old_password"
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await repo.updatePassword(email, hashedPassword);

  return {
    status: 200,
    message: "password_reset_successful"
  };
};
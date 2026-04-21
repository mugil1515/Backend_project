const repo = require('../repository/userRepository');
const { generateOTP, getOTPExpiryTime } = require('../utils/tokenUtil');
const { sendEmail } = require('./emailService');
const { otpEmailTemplate } = require('../utils/emailotpTemplate');

exports.sendOTP = async (identifier) => {
  const user = await repo.findUserByEmailOrPhone(identifier);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (!user.email) {
    return {
      status: 400,
      message: "Email not available for OTP"
    };
  }

  const otp = generateOTP();
  const expiry = getOTPExpiryTime(5);

  await repo.updateOTP(user.id, otp, expiry);

  await sendEmail(
    user.email,
    "Your OTP Code",
    `Your OTP is ${otp}. It expires in 5 minutes.`,
     otpEmailTemplate(otp)
  );

  return {
    success: true,
    status: 200,
    message: "OTP sent successfully",
    
  };
};
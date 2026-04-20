const repo = require('../repository/userRepository');
const { generateOTP, getOTPExpiryTime } = require('../utils/tokenUtil');

exports.sendOTP = async (identifier) => {
  const user = await repo.findUserByEmailOrPhone(identifier);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const otp = generateOTP();
  const expiry = getOTPExpiryTime(5);

  await repo.updateOTP(user.id, otp, expiry);
  console.log("Generated OTP:", otp);

  return {
    success: true,
    status: 200,
    message: "OTP sent successfully",
  };
};
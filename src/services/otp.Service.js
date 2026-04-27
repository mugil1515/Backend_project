const repo = require('../repository/userRepository');
const { generateOTP, getOTPExpiryTime } = require('../utils/tokenUtil');
const { sendEmail } = require('./email.Service');
const { otpEmailTemplate } = require('../utils/emailotpTemplate');

exports.sendOTP = async (email) => {
  try {
    const user = await repo.findUserByEmail(email);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "user_not_found"
      };
    }
    const otp = generateOTP();
    const expiry = getOTPExpiryTime(5);

    await repo.saveOTP(user.email, otp, expiry);

    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP is ${otp}`,
      otpEmailTemplate(otp)
    );

    return {
      success: true,
      status: 200,
      message: "otp_sent_successfully"
    };

  } catch (error) {
    console.error("OTP Send Error:", error.message);

    return {
      success: false,
      status: 500,
      message: "failed_to_send_otp"
    };
  }
};
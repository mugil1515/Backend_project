const repo = require('../repository/userRepository');
const { generateOTP, getOTPExpiryTime } = require('../utils/tokenUtil');
const { sendEmail } = require('./email.Service');
const { otpEmailTemplate } = require('../utils/emailotpTemplate');

exports.sendOTP = async (email) => {
  try {
    // 🔹 1. Check user exists
    const user = await repo.findUserByEmail(email);

    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found"
      };
    }

    // 🔹 2. Generate OTP + expiry
    const otp = generateOTP();
    const expiry = getOTPExpiryTime(5); // 5 minutes

    // 🔹 3. Save OTP in DB
    await repo.updateOTP(user.id, otp, expiry);

    // 🔹 4. Send Email using template
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP is ${otp}. It is valid for 5 minutes.`,
      otpEmailTemplate(otp)
    );

    // 🔹 5. Response
    return {
      success: true,
      status: 200,
      message: "OTP sent successfully"
    };

  } catch (error) {
    console.error("OTP Send Error:", error.message);

    return {
      success: false,
      status: 500,
      message: "Failed to send OTP"
    };
  }
};
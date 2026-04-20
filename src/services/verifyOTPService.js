const repo = require('../repository/userRepository');
const { isOTPExpired } = require('../utils/tokenUtil');

exports.verifyOTP = async (identifier, otp) => {
  const user = await repo.findUserByEmailOrPhone(identifier);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  if (!user.otp) {
    return { status: 400, message: "No OTP found. Please request again" };
  }

  if (user.otp !== otp) {
    return { status: 400, message: "Invalid OTP" };
  }

  if (isOTPExpired(user.otp_expiry)) {
    return { status: 400, message: "OTP expired" };
  }

  await repo.updateOTP(user.id, null, null);
   const safeUser = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    contactno: user.contactno,
    address: user.address,
    created_at: user.created_at
  };

  return {
    status: 200,
    message: "OTP verified successfully",
    data:safeUser,
  };
};
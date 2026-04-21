const service=require('../services/verifyOTP.Service');

exports.verifyOTPController = async (req, res, next) => {
  const { identifier, otp } = req.body;

  const result = await service.verifyEmailOTP(identifier, otp);

  res.json(result);
};
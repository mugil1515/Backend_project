const userService=require('../services/verifyOTPService')
exports.verifyOTP = async (req, res, next) => {
  try {
    const { identifier, otp } = req.body;

    const result = await userService.verifyOTP(identifier, otp);

    if (result.status !== 200) {
      return res.status(result.status).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data || null
    });

  } catch (error) {
    next(error); 
  }
};
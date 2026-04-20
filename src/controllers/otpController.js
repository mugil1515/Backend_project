const userService=require('../services/otpService')

exports.sendOTP = async (req, res, next) => {
  try {
    const { identifier } = req.body;

    const result = await userService.sendOTP(identifier);

    if (result.status !== 200) {
      return res.status(result.status).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    next(error); 
  }
};
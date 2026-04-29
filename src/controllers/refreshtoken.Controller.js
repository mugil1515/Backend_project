const authService=require('../services/refreshtoken.Service');

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      const err = new Error("Session expired. Please login again.");
      err.statusCode = 401;
      return next(err);
    }

    const accessToken = await authService.refreshAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      accessToken
    });

  } catch (err) {
    return next(err);
  }
};
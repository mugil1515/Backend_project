const service =require('../services/login.Service');

exports.login = async (req, res, next) => {
  try {
    const response = await service.loginUser(req.body);
    if (!response.success) return next(response);

    // 🍪 Set cookie
    res.cookie("token", response.accessToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(response.status).json({
      success: true,
      message: response.message
    });

  } catch (err) {
    next(err);
  }
};
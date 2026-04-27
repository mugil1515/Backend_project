exports.logout = (req, res, next) => {

  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    res.status(200).json({
      success: true,
      message: "logged_out_successfully"
    });

  } catch (error) {
    next(error);
  }
};
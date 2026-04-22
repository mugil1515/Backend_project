
exports.logout = (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,      
      sameSite: "Strict"
    });

    res.statusCode = 200;
    res.locals.data = {
      success: true,
      message: "Logged out successfully"
    };

    next(); 
  } catch (error) {
    next(error); 
  }
};
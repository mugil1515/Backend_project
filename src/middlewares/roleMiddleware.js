exports.authorizeRoles = (...allowedRoles) => {
    
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "unauthorized_user",
        });
      }

      const role = req.user.role?.trim()?.toLowerCase();

       if (role !== "admin") {
         return res.status(403).json({
         success: false,
         message: "admin_access_only",
  });
}
      next();

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server_error",
      });
    }
  };
};
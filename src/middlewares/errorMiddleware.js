exports.errorHandler = (err, req, res, next) => {

  console.error("ERROR:", err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || null
  });
};
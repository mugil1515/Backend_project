exports.sendResponse = (req, res) => {
  res.status(res.statusCode || 200).json(res.locals.data);
};
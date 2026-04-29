const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

exports.generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      contactno: user.contactno
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_SECRET_EXPIRES_IN } 
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN } 
  );
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.isOTPExpired = (expiryTime) => {
  return new Date() > new Date(expiryTime);
};

exports.getOTPExpiryTime = (minutes = 5) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
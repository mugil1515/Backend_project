const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
      role: user.role 
    },
    process.env.JWT_ACCESS,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_REFRESH,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }  
  );
};


exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH);
  } catch (err) {
    return null; // 
  }
};

exports.generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

exports.isOTPExpired = (expiryTime) => {
  if (!expiryTime) return true;
  return Date.now() > new Date(expiryTime).getTime();
};

exports.getOTPExpiryTime = (minutes = 5) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
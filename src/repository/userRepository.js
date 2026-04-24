const db = require("../config/db");


// 🔹 Find user by email (used everywhere in service)
exports.findUserByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT id, firstname, lastname, email, contactno, address, password, otp, otp_expiry
     FROM users 
     WHERE email = ?`,
    [email]
  );

  return rows[0];
};

// 🔹 Find user by email or phone (login use)
exports.findUserByEmailOrPhone = async (identifier) => {
  const [rows] = await db.query(
    `SELECT id, firstname, lastname, email, contactno, address, password, otp, otp_expiry 
    From users
     WHERE email = ? OR contactno = ?`,
    [identifier, identifier]
  );

  return rows[0];
};


// 🔹 Create user
exports.createUser = async (data) => {
  const [result] = await db.query(
    `INSERT INTO users SET ?`,
    data
  );

  return result.insertId;
};


// 🔹 Save OTP (USED FOR BOTH forgot password + email verification)
exports.saveOTP = async (email, otp, expiry) => {
  await db.query(
    `UPDATE users 
     SET otp = ?, otp_expiry = ?
     WHERE email = ?`,
    [otp, expiry, email]
  );
};


// 🔹 Clear OTP after success
exports.clearOTP = async (email) => {
  await db.query(
    `UPDATE users 
     SET otp = NULL, otp_expiry = NULL
     WHERE email = ?`,
    [email]
  );
};


// 🔹 Update password (FIXED - uses email now)
exports.updatePassword = async (email, hashedPassword) => {
  await db.query(
    `UPDATE users 
     SET password = ?, otp = NULL, otp_expiry = NULL
     WHERE email = ?`,
    [hashedPassword, email]
  );
};

// 🔹 Find user by ID (profile)
exports.findUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, firstname, lastname, email, contactno, address 
     FROM users 
     WHERE id = ?`,
    [id]
  );

  return rows[0];
};
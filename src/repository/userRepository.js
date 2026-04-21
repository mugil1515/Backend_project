const db = require('../config/db');

exports.findUserByEmailOrPhone = async (identifier) => {
  const [rows] = await db.query(
    `SELECT id, firstname, lastname, email, contactno, address, password, otp, otp_expiry, created_at 
     FROM users
     WHERE email = ? OR contactno = ?`,
    [identifier, identifier]
  );

  return rows[0];
};

exports.createUser = async (data) => {
  const [result] = await db.query(
    `INSERT INTO users SET ?`,
    data
  );

  return result.insertId;
};

exports.updateOTP = async (id, otp, expiry) => {
  await db.query(
    `UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?`,
    [otp, expiry, id]
  );
};
exports.findUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, firstname, lastname, email, contactno, address FROM users WHERE id = ?",
    [id]
  );

  return rows[0]; 
};
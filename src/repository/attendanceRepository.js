const db = require("../config/db");

// ========================================
// PUNCH IN
// ========================================

exports.punchIn = async ({
  userId,
  latitude,
  longitude,
  punchInTime
}) => {

  const [result] = await db.query(
    `
    INSERT INTO attendance (
      user_id,
      punch_in,
      punch_in_lat,
      punch_in_lng,
      attendance_status
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      userId,
      punchInTime,
      latitude,
      longitude,
      "PRESENT" 
    ]
  );

  return result;
};

exports.getTodayPunchIn = async (userId) => {

  const [rows] = await db.query(
    `
    SELECT id
    FROM attendance
    WHERE user_id = ?
      AND DATE(punch_in) = CURDATE()
      AND punch_out IS NULL
    LIMIT 1
    `,
    [userId]
  );

  return rows.length > 0 ? rows[0] : null;
};

// ========================================
// PUNCH OUT
// ========================================

exports.punchOut = async ({
  userId,
  latitude,
  longitude,
  punchOutTime,
  workingHours,
  status
}) => {

  const [result] = await db.query(
    `
    UPDATE attendance
    SET 
      punch_out = ?,
      punch_out_lat = ?,
      punch_out_lng = ?,
      working_hours = ?,
      attendance_status = ?
    WHERE user_id = ?
      AND DATE(punch_in) = CURDATE()
    `,
    [
      punchOutTime,
      latitude,
      longitude,
      workingHours,
      status,
      userId
    ]
  );

  return result;
};

// ========================================
// GET TODAY ATTENDANCE
// ========================================

exports.getTodayAttendance = async (userId) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM attendance
    WHERE user_id = ?
      AND DATE(punch_in) = CURDATE()
    LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
};
// ========================================
// GET ATTENDANCE HISTORY
// ========================================

exports.getAttendanceHistory = async (userId) => {

  const [rows] = await db.query(
    `
    SELECT *
    FROM attendance
    WHERE user_id = ?
    ORDER BY punch_in DESC
    `,
    [userId]
  );

  return rows;
};
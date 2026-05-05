const db = require("../config/db");

// =========================
// CREATE ATTENDANCE (PUNCH IN)
// =========================
exports.createAttendance = async ({
  userId,
  latitude,
  longitude,
  status
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
    VALUES (?, NOW(), ?, ?, ?)
    `,
    [userId, latitude, longitude, status]
  );

  return result;
};

// =========================
// GET TODAY ATTENDANCE
// =========================
exports.getTodayAttendance = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      punch_in,
      punch_out,
      working_hours,
      attendance_status,
      created_at
    FROM attendance
    WHERE user_id = ?
    AND DATE(punch_in) = CURDATE()
    `,
    [userId]
  );

  return rows.length > 0 ? rows[0] : null;
};

// =========================
// UPDATE PUNCH OUT
// =========================
exports.updatePunchOut = async ({
  attendanceId,
  latitude,
  longitude,
  workingHours,
  status
}) => {
  const [result] = await db.query(
    `
    UPDATE attendance
    SET
      punch_out = NOW(),
      punch_out_lat = ?,
      punch_out_lng = ?,
      working_hours = ?,
      attendance_status = ?
    WHERE id = ?
    `,
    [latitude, longitude, workingHours, status, attendanceId]
  );

  return result;
};

// =========================
// GET ATTENDANCE HISTORY
// =========================

exports.getAttendanceHistory = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      punch_in,
      punch_out,
      working_hours,
      attendance_status,
      created_at
    FROM attendance
    WHERE user_id = ?
    ORDER BY punch_in DESC
    `,
    [userId]
  );

  return rows;
};

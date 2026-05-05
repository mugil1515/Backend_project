const db = require("../config/db");

// =======================================
// TOTAL USERS
// =======================================

exports.getTotalUsers = async () => {

  const [rows] = await db.query(`

    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'USER'
  `);

  return rows[0].total;
};


// =======================================
// PRESENT TODAY
// =======================================

exports.getPresentToday = async () => {

  const [rows] = await db.query(`

    SELECT COUNT(DISTINCT user_id) AS total
    FROM attendance
    WHERE DATE(punch_in) = CURDATE()

  `);

  return rows[0].total;
};


// =======================================
// ABSENT TODAY
// =======================================

exports.getAbsentToday = async () => {

  const [totalUsers] = await db.query(`

    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'USER'

  `);

  const [presentUsers] = await db.query(`

    SELECT COUNT(DISTINCT user_id) AS total
    FROM attendance
    WHERE DATE(punch_in) = CURDATE()

  `);

  return (
    totalUsers[0].total -
    presentUsers[0].total
  );
};


// =======================================
// LATE USERS
// =======================================

exports.getLateUsers = async () => {

  const [rows] = await db.query(`

    SELECT COUNT(*) AS total
    FROM attendance
    WHERE DATE(punch_in) = CURDATE()
    AND attendance_status = 'LATE'

  `);

  return rows[0].total;
};


// =======================================
// HALF DAY USERS
// =======================================

exports.getHalfDayUsers = async () => {

  const [rows] = await db.query(`

    SELECT COUNT(*) AS total
    FROM attendance
    WHERE DATE(punch_in) = CURDATE()
    AND attendance_status = 'HALF_DAY'

  `);

  return rows[0].total;
};


// =======================================
// TODAY ATTENDANCE LIST
// =======================================

exports.getTodayAttendanceList = async () => {

  const [rows] = await db.query(`

    SELECT
      a.id,
      u.id AS user_id,
      u.firstname,
      u.lastname,
      u.email,
      a.punch_in,
      a.punch_out,
      a.working_hours,
      a.attendance_status

    FROM attendance a

    INNER JOIN users u
    ON a.user_id = u.id

    WHERE DATE(a.punch_in) = CURDATE()

    ORDER BY a.punch_in DESC

  `);

  return rows;
};


// =======================================
// GET ALL ATTENDANCE
// =======================================

exports.getAllAttendance = async ({
  page,
  limit,
  search,
  status,
  date
}) => {

  const offset = (page - 1) * limit;

  let query = `

    SELECT
      a.id,
      u.id AS user_id,
      u.firstname,
      u.lastname,
      u.email,
      a.punch_in,
      a.punch_out,
      a.working_hours,
      a.attendance_status,
      a.created_at

    FROM attendance a

    INNER JOIN users u
    ON a.user_id = u.id

    WHERE 1=1
  `;

  const values = [];



  // SEARCH
  if (search) {

    query += `
      AND (
        u.firstname LIKE ?
        OR u.lastname LIKE ?
        OR u.email LIKE ?
      )
    `;

    values.push(
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    );
  }



  // STATUS FILTER
  if (status) {

    query += `
      AND a.attendance_status = ?
    `;

    values.push(status);
  }



  // DATE FILTER
  if (date) {

    query += `
      AND DATE(a.punch_in) = ?
    `;

    values.push(date);
  }



  query += `
    ORDER BY a.created_at DESC
    LIMIT ?
    OFFSET ?
  `;

  values.push(
    Number(limit),
    Number(offset)
  );

  const [rows] = await db.query(
    query,
    values
  );

  return rows;
};


// =======================================
// TOTAL ATTENDANCE COUNT
// =======================================

exports.getAttendanceCount = async ({
  search,
  status,
  date
}) => {

  let query = `
    SELECT COUNT(*) AS total
    FROM attendance a
    INNER JOIN users u
    ON a.user_id = u.id
    WHERE 1=1
  `;

  const values = [];



  // SEARCH
  if (search) {

    query += `
      AND (
        u.firstname LIKE ?
        OR u.lastname LIKE ?
        OR u.email LIKE ?
      )
    `;

    values.push(
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    );
  }



  // STATUS
  if (status) {

    query += `
      AND a.attendance_status = ?
    `;

    values.push(status);
  }



  // DATE
  if (date) {

    query += `
      AND DATE(a.punch_in) = ?
    `;

    values.push(date);
  }

  const [rows] = await db.query(
    query,
    values
  );

  return rows[0].total;
};


// =======================================
// GET SINGLE ATTENDANCE
// =======================================

exports.getAttendanceById = async (
  attendanceId
) => {

  const [rows] = await db.query(`

    SELECT *
    FROM attendance
    WHERE id = ?

  `, [attendanceId]);

  return rows[0];
};


// =======================================
// UPDATE ATTENDANCE
// =======================================

exports.updateAttendance = async ({
  attendanceId,
  punch_in,
  punch_out,
  working_hours,
  attendance_status
}) => {

  const [result] = await db.query(`

    UPDATE attendance
    SET
      punch_in = ?,
      punch_out = ?,
      working_hours = ?,
      attendance_status = ?

    WHERE id = ?

  `, [
    punch_in,
    punch_out,
    working_hours,
    attendance_status,
    attendanceId
  ]);

  return result;
};


// =======================================
// GET ALL USERS
// =======================================

exports.getAllUsers = async () => {

  const [rows] = await db.query(`

    SELECT
      id,
      firstname,
      lastname,
      email,
      contactno,
      role,
      created_at

    FROM users

    WHERE role = 'USER'

    ORDER BY created_at DESC

  `);

  return rows;
};


// =======================================
// GET USER BY ID
// =======================================

exports.getUserById = async (userId) => {

  const [rows] = await db.query(`

    SELECT
      id,
      firstname,
      lastname,
      email,
      contactno,
      role,

    FROM users

    WHERE id = ?

  `, [userId]);

  return rows[0];
};


// =======================================
// UPDATE USER
// =======================================

exports.updateUser = async ({
  userId,
  firstname,
  lastname,
  contactno,
  is_active
}) => {

  const [result] = await db.query(`

    UPDATE users
    SET
      firstname = ?,
      lastname = ?,
      contactno = ?
    WHERE id = ?

  `, [
    firstname,
    lastname,
    contactno,
    userId
  ]);

  return result;
};
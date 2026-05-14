const db = require("../config/db");


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
exports.getAllAttendance = async ({ page, limit, search, status, startDate, endDate, month }) => {
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
      a.attendance_status
    FROM attendance a
    INNER JOIN users u ON a.user_id = u.id
    WHERE 1=1
  `;

  const values = [];

  if (search) {
    query += ` AND (u.firstname LIKE ? OR u.lastname LIKE ? OR u.email LIKE ?)`;
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ` AND a.attendance_status = ?`;
    values.push(status);
  }
if (startDate && endDate) {
  query += ` AND DATE(a.punch_in) BETWEEN ? AND ?`;
  values.push(startDate, endDate);
} else if (startDate) {
  query += ` AND DATE(a.punch_in) >= ?`;
  values.push(startDate);
} else if (endDate) {
  query += ` AND DATE(a.punch_in) <= ?`;
  values.push(endDate);
} else if (month) {
  query += ` AND DATE_FORMAT(a.punch_in, '%Y-%m') = ?`;
  values.push(month);
}

  query += ` ORDER BY a.punch_in DESC LIMIT ? OFFSET ?`;
  values.push(Number(limit), Number(offset));

  const [rows] = await db.query(query, values);
  return rows;
};
// =======================================
// TOTAL ATTENDANCE COUNT
// =======================================
exports.getAttendanceCount = async ({ search, status, startDate, endDate, month }) => {
  let query = `
    SELECT COUNT(*) AS total
    FROM attendance a
    INNER JOIN users u ON a.user_id = u.id
    WHERE 1=1
  `;

  const values = [];

  if (search) {
    query += ` AND (u.firstname LIKE ? OR u.lastname LIKE ? OR u.email LIKE ?)`;
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ` AND a.attendance_status = ?`;
    values.push(status);
  }
if (startDate && endDate) {
  query += ` AND DATE(a.punch_in) BETWEEN ? AND ?`;
  values.push(startDate, endDate);
} else if (startDate) {
  query += ` AND DATE(a.punch_in) >= ?`;
  values.push(startDate);
} else if (endDate) {
  query += ` AND DATE(a.punch_in) <= ?`;
  values.push(endDate);
} else if (month) {
  query += ` AND DATE_FORMAT(a.punch_in, '%Y-%m') = ?`;
  values.push(month);
}

  const [rows] = await db.query(query, values);
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
      address

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
      role

    FROM users

    WHERE id = ?

  `, [userId]);

  return rows[0];
};


// =======================================
// UPDATE USER
// =======================================

exports.updateUser = async ({ userId, ...fields }) => {

  if (!userId) {
    throw new Error("User ID is required");
  }

  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(
      ([_, value]) => value !== undefined
    )
  );

  const keys = Object.keys(filteredFields);

  if (keys.length === 0) {
    throw new Error("No fields provided");
  }

  const setClause = keys
    .map(key => `${key} = ?`)
    .join(", ");

  const values = keys.map(key => filteredFields[key]);

  const [result] = await db.query(
    `
    UPDATE users
    SET ${setClause}
    WHERE id = ?
    `,
    [...values, userId]
  );

  return result;
};

exports.deleteUser = async (userId) => {

  const [result] = await db.query(`
    DELETE FROM users
    WHERE id = ?
  `, [userId]);

  return result;
};

exports.deleteAttendance = async (attendanceId) => {

  const [result] = await db.query(`
    DELETE FROM attendance
    WHERE id = ?
  `, [attendanceId]);

  return result;
};


exports.getAdminById = async (
  adminId
) => {

  const [rows] = await db.query(
    `
    SELECT
      id,
      firstname,
      lastname,
      email,
      contactno,
      address,
      role
    FROM users
    WHERE id = ?
    AND role = 'ADMIN'
    `,
    [adminId]
  );

  return rows[0];
};

exports.updateAdmin = async ({ adminId, ...fields }) => {

  // ✅ Allow only valid DB columns
  const allowedFields = [
    "firstname",
    "lastname",
    "email",
    "contactno",
    "address",
    "role"
  ];

  const keys = Object.keys(fields).filter(key =>
    allowedFields.includes(key)
  );

  if (keys.length === 0) {
    throw new Error("No valid fields provided");
  }

  const setClause = keys
    .map(key => `${key} = ?`)
    .join(", ");

  const values = keys.map(key => fields[key]);

  const [result] = await db.query(
    `
    UPDATE users
    SET ${setClause}
    WHERE id = ?
    AND role = 'ADMIN'
    `,
    [...values, adminId]
  );

  return result;
};

// ==========================================
// GET ATTENDANCE HISTORY
// ==========================================
exports.getAttendanceHistory = async (userId, filters) => {
  const { startDate, endDate, status, limit, offset } = filters;
  
let query = `
  SELECT
    DATE_FORMAT(CONVERT_TZ(punch_in, '+00:00', '+05:30'), '%Y-%m-%d') AS date,
    DATE_FORMAT(CONVERT_TZ(punch_in, '+00:00', '+05:30'), '%a') AS day,
    attendance_status AS status,
    punch_in,
    punch_out,
    working_hours
  FROM attendance
  WHERE user_id = ?
`;
  const values = [userId];

  // DATE FILTER
  const start = startDate && startDate.trim() !== "" ? startDate : null;
  const end = endDate && endDate.trim() !== "" ? endDate : null;

  if (start && end) {
  query += ` AND DATE(CONVERT_TZ(punch_in, '+00:00', '+05:30')) BETWEEN ? AND ?`;
  values.push(start, end);
} else {
  query += ` AND DATE(CONVERT_TZ(punch_in, '+00:00', '+05:30')) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
}

  // STATUS FILTER
  if (status) {
    query += ` AND attendance_status = ?`;
    values.push(status);
  }

  // COUNT QUERY
  const countQuery = `SELECT COUNT(*) AS total FROM (${query}) AS counted`;
  const [countRows] = await db.query(countQuery, values);
  const total = Number(countRows[0].total);

  // PAGINATION
  if (limit !== null && limit !== undefined) {
    query += ` ORDER BY punch_in DESC LIMIT ? OFFSET ?`;
    values.push(Number(limit), Number(offset));
  } else {
    query += ` ORDER BY punch_in DESC`;
  }

  const [rows] = await db.query(query, values);

  return { rows, total };
};
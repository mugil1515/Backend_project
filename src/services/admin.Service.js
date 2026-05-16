const repo = require("../repository/attendanceRepository");
const adminRepo = require("../repository/adminRepository");

const {
  getLateMinutes,
  getEarlyMinutes
} = require("../utils/attendanceCalci");

// ==========================
// DASHBOARD
// ==========================
exports.getDashboard = async () => {

  const totalUsers = await adminRepo.getTotalUsers();
  const presentToday = await adminRepo.getPresentToday();
  const lateUsers = await adminRepo.getLateUsers();

  return {
    totalUsers,
    presentToday,
    lateUsers
  };
};

// ==========================
// TODAY ATTENDANCE
// ==========================
exports.getTodayAttendanceList = async () => {
  const data = await adminRepo.getTodayAttendanceList();
  return data.map((r) => ({
    ...r,
    lateMinutes: r.punch_in ? getLateMinutes(r.punch_in) : 0,
    earlyLogoutMinutes: r.punch_out ? getEarlyMinutes(r.punch_out) : 0
  }));
};

/// ==========================
// ALL ATTENDANCE (FILTER + PAGINATION)
// ==========================
exports.getAllAttendance = async (query) => {

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  if (page < 1 || limit < 1) {
    const err = new Error("Invalid pagination values");
    err.status = 400;
    throw err;
  }

 const { search, status, startDate, endDate, month } = query; 

 const [data, total] = await Promise.all([
  adminRepo.getAllAttendance({ page, limit, search, status, startDate, endDate, month }),
  adminRepo.getAttendanceCount({ search, status, startDate, endDate, month })
]);

  return {
    data: data.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      firstname: r.firstname,
      lastname: r.lastname,
      email: r.email,
      address: r.address,
      punch_in: r.punch_in,
      punch_out: r.punch_out,
      working_hours: r.working_hours,
      attendance_status: r.attendance_status,
      lateMinutes: r.punch_in ? getLateMinutes(r.punch_in) : 0,
      earlyLogoutMinutes: r.punch_out ? getEarlyMinutes(r.punch_out) : 0
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
// ==========================
// SINGLE ATTENDANCE
// ==========================
exports.getAttendanceById = async (id) => {

  if (!id) {
    const err = new Error("Attendance ID required");
    err.status = 400;
    throw err;
  }

  const data = await adminRepo.getAttendanceById(id);

  if (!data) return null;

  return {
    ...data,
    lateMinutes: data.punch_in
      ? getLateMinutes(data.punch_in)
      : 0
  };
};

// ==========================
// UPDATE ATTENDANCE
// ==========================
exports.updateAttendance = async (id, body) => {

  if (!id) {
    const err = new Error("Attendance ID required");
    err.status = 400;
    throw err;
  }

  if (!body || Object.keys(body).length === 0) {
    const err = new Error("No data to update");
    err.status = 400;
    throw err;
  }

  const existing = await adminRepo.getAttendanceById(id);

  if (!existing) {
    const err = new Error("Attendance not found");
    err.status = 404;
    throw err;
  }

  await adminRepo.updateAttendance(id, body);

  return true;
};

// ==========================
// GET ALL USERS
// ==========================
exports.getAllUsers = async () => {

  const users = await adminRepo.getAllUsers();

  return users.map((u) => ({
    ...u,
    fullname: `${u.firstname} ${u.lastname}`
  }));
};

// ==========================
// GET USER BY ID
// ==========================
exports.getUserById = async (id) => {

  if (!id) {
    const err = new Error("User ID required");
    err.status = 400;
    throw err;
  }

  const user = await adminRepo.getUserById(id);

  if (!user) return null;

  return {
    ...user,
    fullname: `${user.firstname} ${user.lastname}`
  };
};

// ==========================
// UPDATE USER
// ==========================
exports.updateUser = async (id, body) => {

  if (!id) {
    const err = new Error("User ID is required");
    err.status = 400;
    throw err;
  }

  const filteredBody = Object.fromEntries(
    Object.entries(body || {}).filter(
      ([_, value]) => value !== undefined
    )
  );

  if (Object.keys(filteredBody).length === 0) {
    const err = new Error("No data provided to update");
    err.status = 400;
    throw err;
  }

  const existingUser = await adminRepo.getUserById(id);

  if (!existingUser) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  const result = await adminRepo.updateUser({
    userId: id,
    ...filteredBody
  });

  return result;
};
// ==========================
// DELETE USER
// ==========================
exports.deleteUser = async (userId) => {

  if (!userId) {
    const err = new Error("User ID required");
    err.status = 400;
    throw err;
  }

  const result = await adminRepo.deleteUser(userId);

  if (result.affectedRows === 0) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "User deleted successfully"
  };
};

// GET ADMIN BY ID

exports.getAdminById = async (
  adminId
) => {

  if (!adminId) {
    const err = new Error(
      "Admin ID required"
    );
    err.status = 400;
    throw err;
  }

  const admin =
    await adminRepo.getAdminById(adminId);

  if (!admin) {
    const err = new Error(
      "Admin not found"
    );
    err.status = 404;
    throw err;
  }

  return admin;
};

exports.updateAdmin = async (
  adminId,
  body
) => {

  if (!adminId) {
    const err = new Error("Admin ID is required");
    err.status = 400;
    throw err;
  }

  const filteredBody = Object.fromEntries(
    Object.entries(body || {}).filter(
      ([_, value]) => value !== undefined
    )
  );

  if (Object.keys(filteredBody).length === 0) {
    const err = new Error(
      "No data provided to update"
    );
    err.status = 400;
    throw err;
  }

  const existingAdmin =
    await adminRepo.getAdminById(adminId);

  if (!existingAdmin) {
    const err = new Error("Admin not found");
    err.status = 404;
    throw err;
  }

  const result =
    await adminRepo.updateAdmin({
      adminId,
      ...filteredBody
    });

  return result;
};
// ==========================================
// GET ATTENDANCE HISTORY
// ==========================================

exports.getAttendanceHistory = async (userId, filters) => {
  const { startDate, endDate, status, page, limit } = filters;
  const offset = (page - 1) * limit;

  const result = await adminRepo.getAttendanceHistory(userId, {
  startDate: null,  // remove date filter from repo
  endDate: null,    // service handles range
  status,
  limit: null,
  offset: 0
});

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toLocalDateStr = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const rangeStart = startDate
  ? (() => { const [y,m,d] = startDate.split("-").map(Number); return new Date(y, m-1, d); })()
  : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);

const rangeEnd = endDate
  ? (() => { const [y,m,d] = endDate.split("-").map(Number); return new Date(y, m-1, d); })()
  : today;

  const presentMap = {};
  result.rows.forEach(row => {
    presentMap[row.date] = row;
  });

  const fullRows = [];
  const cursor = new Date(rangeStart);

  while (cursor <= rangeEnd) {
    const dateStr = toLocalDateStr(cursor);
    const dayOfWeek = cursor.getDay();

    if (presentMap[dateStr]) {
      fullRows.push(presentMap[dateStr]);
    } else if (dayOfWeek === 0) {
      fullRows.push({
        date: dateStr,
        day: cursor.toLocaleDateString("en-US", { weekday: "short" }),
        status: "OFF",
        punch_in: null,
        punch_out: null,
        working_hours: "0.00"
      });
    } else {
      fullRows.push({
        date: dateStr,
        day: cursor.toLocaleDateString("en-US", { weekday: "short" }),
        status: "ABSENT",
        punch_in: null,
        punch_out: null,
        working_hours: "0.00"
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  fullRows.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = fullRows.length;
  const presentCount = fullRows.filter(i => i.status === "PRESENT").length;
  const absentCount = fullRows.filter(i => i.status === "ABSENT").length;
  const offCount = fullRows.filter(i => i.status === "OFF").length;
  const workingDays = total - offCount;
  const attendanceRate = workingDays > 0
    ? ((presentCount / workingDays) * 100).toFixed(1)
    : 0;

  return {
    data: fullRows,
    summary: {
      present: presentCount,
      absent: absentCount,
      total,
      attendanceRate
    },
  };
};
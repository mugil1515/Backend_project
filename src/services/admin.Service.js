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
exports.getTodayAttendance = async () => {

  const data = await adminRepo.getTodayAttendance();

  return data.map((r) => ({
    ...r,
    lateMinutes: r.punch_in
      ? getLateMinutes(r.punch_in)
      : 0
  }));
};

// ==========================
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

  const data = await adminRepo.getAllAttendance({
    ...query,
    page,
    limit
  });

  return data.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    firstname: r.firstname,
    lastname: r.lastname,
    email: r.email,
    punch_in: r.punch_in,
    punch_out: r.punch_out,
    working_hours: r.working_hours,
    attendance_status: r.attendance_status,


    lateMinutes: r.punch_in
      ? getLateMinutes(r.punch_in)
      : 0,

    earlyLogoutMinutes: r.punch_out
      ? getEarlyMinutes(r.punch_out)
      : 0
  }));
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
    const err = new Error("User ID required");
    err.status = 400;
    throw err;
  }

  if (!body || Object.keys(body).length === 0) {
    const err = new Error("No data to update");
    err.status = 400;
    throw err;
  }

  const existing = await adminRepo.getUserById(id);

  if (!existing) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  await adminRepo.updateUser(id, body);

  return true;
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

// ==========================
// DELETE ATTENDANCE
// ==========================
exports.deleteAttendance = async (attendanceId) => {

  if (!attendanceId) {
    const err = new Error("Attendance ID required");
    err.status = 400;
    throw err;
  }

  const result = await adminRepo.deleteAttendance(attendanceId);

  if (result.affectedRows === 0) {
    const err = new Error("Attendance not found");
    err.status = 404;
    throw err;
  }

  return {
    success: true,
    message: "Attendance deleted successfully"
  };
};
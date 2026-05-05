const adminRepo = require("../repository/adminRepository");


// ==========================
// DASHBOARD
// ==========================

exports.getDashboard = async () => {

  const totalUsers = await adminRepo.getTotalUsers();
  const presentToday = await adminRepo.getPresentToday();
  const absentToday = await adminRepo.getAbsentToday();
  const lateUsers = await adminRepo.getLateUsers();
  const halfDayUsers = await adminRepo.getHalfDayUsers();

  return {
    totalUsers,
    presentToday,
    absentToday,
    lateUsers,
    halfDayUsers
  };
};


// ==========================
// TODAY ATTENDANCE
// ==========================

exports.getTodayAttendance = async () => {

  return await adminRepo.getTodayAttendanceList();
};


// ==========================
// ALL ATTENDANCE (PAGINATION)
// ==========================

exports.getAllAttendance = async (query) => {

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const data = await adminRepo.getAllAttendance({
    page,
    limit,
    search: query.search,
    status: query.status,
    date: query.date
  });

  const total = await adminRepo.getAttendanceCount({
    search: query.search,
    status: query.status,
    date: query.date
  });

  return {
    data,
    total,
    page,
    limit
  };
};


// ==========================
// SINGLE ATTENDANCE
// ==========================

exports.getAttendanceById = async (id) => {
  return await adminRepo.getAttendanceById(id);
};


// ==========================
// UPDATE ATTENDANCE
// ==========================

exports.updateAttendance = async (id, body) => {

  return await adminRepo.updateAttendance({
    attendanceId: id,
    punch_in: body.punch_in,
    punch_out: body.punch_out,
    working_hours: body.working_hours,
    attendance_status: body.attendance_status
  });
  return true;
};


// ==========================
// USERS
// ==========================

exports.getAllUsers = async () => {
  return await adminRepo.getAllUsers();
};


// ==========================
// SINGLE USER
// ==========================

exports.getUserById = async (id) => {
  return await adminRepo.getUserById(id);
};


// ==========================
// UPDATE USER
// ==========================

exports.updateUser = async (id, body) => {

  return await adminRepo.updateUser({
    userId: id,
    firstname: body.firstname,
    lastname: body.lastname,
    contactno: body.contactno
  });
};
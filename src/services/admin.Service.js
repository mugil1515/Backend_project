const repo = require("../repository/attendanceRepository");
const adminRepo=require("../repository/adminRepository"); 

const {calculateDistance} = require("../utils/distanceutil");

const {
  OFFICE_LAT,
  OFFICE_LNG,
  ALLOWED_RADIUS,
  OFFICE_START_HOUR,
  OFFICE_START_MINUTE
} = require("../config/attendance.config");


// ===============================
// PUNCH IN SERVICE
// ===============================

exports.punchIn = async ({
  userId,
  latitude,
  longitude
}) => {

  // VALIDATION
  if (!userId || latitude == null || longitude == null) {
    const err = new Error(
      "Missing required fields"
    );
    err.status = 400;
    throw err;
  }

  // LOCATION CHECK
  const distance =
    calculateDistance(
      latitude,
      longitude,
      OFFICE_LAT,
      OFFICE_LNG
    );

  if (distance > ALLOWED_RADIUS) {
    const err = new Error(
      "You are outside office location"
    );
    err.status = 400;
    throw err;
  }

  // CHECK EXISTING ATTENDANCE
  const existingAttendance =
    await repo.getTodayAttendance(userId);

  if (existingAttendance) {
    const err = new Error(
      "Already punched in today"
    );
    err.status = 400;
    throw err;
  }

  // STATUS CALCULATION
  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  const officeStartMinutes =
    OFFICE_START_HOUR * 60 +
    OFFICE_START_MINUTE;

  const status =
    currentMinutes > officeStartMinutes
      ? "LATE"
      : "PRESENT";

  // INSERT
  await repo.createAttendance({
    userId,
    latitude,
    longitude,
    status
  });

  return {
    success: true,
    message: "Punch in successful"
  };
};
// =======================================
// DELETE USER
// =======================================

exports.deleteUser = async (userId) => {
  const result = await adminRepo.deleteUser(userId);

  if (result.affectedRows === 0) {
    throw new Error("User not found or already deleted");
  }

  return {
    success: true,
    message: "User deleted successfully"
  };
};


// =======================================
// DELETE ATTENDANCE
// =======================================

exports.deleteAttendance = async (attendanceId) => {
  const result = await adminRepo.deleteAttendance(attendanceId);

  if (result.affectedRows === 0) {
    throw new Error("Attendance record not found");
  }

  return {
    success: true,
    message: "Attendance deleted successfully"
  };
};

exports.getAllUsers = async () => {
  return await adminRepo.getAllUsers();
};
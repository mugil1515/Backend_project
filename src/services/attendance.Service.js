// services/attendance.service.js

const repo = require("../repository/attendanceRepository");
const {
  getLateMinutes,
  getEarlyMinutes
} = require("../utils/attendanceCalci");

const {
  calculateDistance
} = require("../utils/distanceutil.js");

const {
  OFFICE_START_HOUR,
  OFFICE_START_MINUTE,
  OFFICE_END_HOUR,
  OFFICE_END_MINUTE,
  HALF_DAY_HOURS,
  OFFICE_LAT,
  OFFICE_LNG,
  ALLOWED_RADIUS
} = require("../config/attendance.config.js");



// ========================================
// PUNCH IN SERVICE
// ========================================

exports.punchIn = async ({
  userId,
  latitude,
  longitude
}) => {

  // ========================================
  // CHECK OFFICE LOCATION
  // ========================================

  const distance = calculateDistance(
    latitude,
    longitude,
    OFFICE_LAT,
    OFFICE_LNG
  );

  if (distance > ALLOWED_RADIUS) {
    throw new Error(
      "You are outside office location"
    );
  }


  // ========================================
  // CHECK ALREADY PUNCHED IN
  // ========================================

  const existingAttendance =
    await repo.getTodayAttendance(userId);

  if (existingAttendance) {
    throw new Error(
      "Already punched in today"
    );
  }


  // ========================================
  // ATTENDANCE STATUS
  // ========================================

  const now = new Date();

  const currentMinutes =
    (now.getHours() * 60) +
    now.getMinutes();

  const officeStartMinutes =
    (OFFICE_START_HOUR * 60) +
    OFFICE_START_MINUTE;

  let status = "PRESENT";

  // After 9:30 AM => LATE

  if (currentMinutes > officeStartMinutes) {
    status = "LATE";
  }


  // ========================================
  // CREATE ATTENDANCE
  // ========================================

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



// ========================================
// PUNCH OUT SERVICE
// ========================================

exports.punchOut = async ({
  userId,
  latitude,
  longitude
}) => {

  // ========================================
  // CHECK OFFICE LOCATION
  // ========================================

  const distance = calculateDistance(
    latitude,
    longitude,
    OFFICE_LAT,
    OFFICE_LNG
  );

  if (distance > ALLOWED_RADIUS) {
    throw new Error(
      "You are outside office location"
    );
  }


  // ========================================
  // FIND TODAY ATTENDANCE
  // ========================================

  const attendance =
    await repo.getTodayAttendance(userId);

  if (!attendance) {
    throw new Error(
      "Please punch in first"
    );
  }


  // ========================================
  // CHECK ALREADY PUNCHED OUT
  // ========================================

  if (attendance.punch_out) {
    throw new Error(
      "Already punched out"
    );
  }


  // ========================================
  // CALCULATE WORKING HOURS
  // ========================================

  const punchInTime =
    new Date(attendance.punch_in);

  const punchOutTime =
    new Date();

  const diffMs =
    punchOutTime - punchInTime;

  const workingHours =
    Number(
      (
        diffMs /
        (1000 * 60 * 60)
      ).toFixed(2)
    );


  // ========================================
  // ATTENDANCE STATUS
  // ========================================

  let status =
    attendance.attendance_status;

  // Less than 4 hours => HALF DAY

  if (workingHours < HALF_DAY_HOURS) {
    status = "HALF_DAY";
  }


  // ========================================
  // UPDATE PUNCH OUT
  // ========================================

  await repo.updatePunchOut({
    attendanceId: attendance.id,
    latitude,
    longitude,
    workingHours,
    status
  });


  return {
    success: true,
    message: "Punch out successful",
    workingHours
  };
};



// ========================================
// GET TODAY ATTENDANCE
// ========================================

exports.getTodayAttendance =
  async (userId) => {

   const attendance =
  await repo.getTodayAttendance(userId);

  if (!attendance) {
    return {
      isPunchedIn: false
    };
  }

  return {
    isPunchedIn: true,

  ...attendance,

  late_minutes: getLateMinutes(attendance.punch_in),

  early_logout_minutes: attendance.punch_out
    ? getEarlyMinutes(attendance.punch_out)
    : 0
}
};


// ========================================
// GET ATTENDANCE HISTORY
// ========================================
exports.getAttendanceHistory = async (userId) => {

  const history =
    await repo.getAttendanceHistory(userId);

  const map = new Map();

  history.forEach((r) => {

    const key = new Date(
      r.punch_in || r.created_at
    ).toDateString();

    map.set(key, r);
  });

  const result = [];

  for (let i = 0; i < 30; i++) {

    const d = new Date();

    d.setDate(d.getDate() - i);

    const key = d.toDateString();

    const r = map.get(key);

    const lateMinutes = r?.punch_in
      ? getLateMinutes(r.punch_in)
      : 0;

    const earlyLogoutMinutes = r?.punch_out
      ? getEarlyMinutes(r.punch_out)
      : 0;

    const isSunday =
      d.getDay() === 0;

    if (r) {

      result.push({

        Id: r.id,

        Date: d.toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        ),

        Status: r.attendance_status,

        In: r.punch_in
          ? new Date(r.punch_in)
              .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })
          : "--",

        Out: r.punch_out
          ? new Date(r.punch_out)
              .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })
          : "--",

        ProductionHours:
          r.working_hours
            ? Number(r.working_hours)
            : 0,

        Late: lateMinutes,

        EarlyLogout:
          earlyLogoutMinutes
      });

    } else {

      result.push({

        Id: null,

        Date: d.toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        ),

        Status: isSunday
          ? "OFF"
          : "ABSENT",

        In: "--",

        Out: "--",

        ProductionHours: 0,

        Late: 0,

        EarlyLogout: 0
      });
    }
  }

  return result.reverse();
};
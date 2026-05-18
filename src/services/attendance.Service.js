const repo = require("../repository/attendanceRepository");

const {
  calculateDistance
} = require("../utils/distanceUtil");

const {
  getOfficeStart,
  getOfficeEnd,
  formatIST,
  formatDate
} = require("../utils/offcTimeutil");

const {
  OFFICE_LAT,
  OFFICE_LNG,
  ALLOWED_RADIUS
} = require("../config/attendance.config");

// ========================================
// GET LOCAL DATE
// ========================================

const getLocalDate = (date) => {

  const d = new Date(date);

  const year = d.getFullYear();

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// ========================================
// PUNCH IN
// ========================================

exports.punchIn = async ({
  userId,
  latitude,
  longitude
}) => {

  // =========================
  // CHECK ALREADY PUNCHED IN
  // =========================
  const existing = await repo.getTodayPunchIn(userId);

  if (existing) {
    throw new Error("Already punched in today");
  }

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

  const punchInTime = new Date();

  await repo.punchIn({
    userId,
    latitude,
    longitude,
    punchInTime,
    status: "PRESENT"
  });

  return {
    message: "Punch-in successful",
    status: "PRESENT"
  };
};

// ========================================
// PUNCH OUT
// ========================================

exports.punchOut = async ({
  userId,
  latitude,
  longitude
}) => {

  const today = await repo.getTodayAttendance(userId);

  if (!today) {
    throw new Error("No punch-in found for today");
  }

  const punchOutTime = new Date();
  const punchInTime = new Date(today.punch_in);

  const diffMs = punchOutTime - punchInTime;
  const workingHours = (diffMs / (1000 * 60 * 60)).toFixed(2);

  await repo.punchOut({
    userId,
    latitude,
    longitude,
    punchOutTime,
    workingHours,
    status: "PRESENT"
  });

  return {
    message: "Punch-out successful"
  };
};


// ========================================
// GET TODAY ATTENDANCE
// ========================================

exports.getTodayAttendance = async (userId) => {

  const data = await repo.getTodayAttendance(userId);

  if (!data) return null;

  const punchInTime = data.punch_in ? new Date(data.punch_in) : null;
  const punchOutTime = data.punch_out ? new Date(data.punch_out) : null;

  const officeStart = getOfficeStart();
  const officeEnd = getOfficeEnd();
  const now = new Date();

  // =========================
  // WORKING HOURS
  // =========================
  let workingHours = "0.00";

  if (punchInTime && punchOutTime) {
    const diff = punchOutTime - punchInTime;
    workingHours = (diff / (1000 * 60 * 60)).toFixed(2);
  }

  // =========================
  // LATE LOGIN (mins)
  // =========================
  let late_login_mins = 0;

  if (punchInTime && punchInTime > officeStart) {
    late_login_mins = Math.floor(
      (punchInTime - officeStart) / (1000 * 60)
    );
  }

  // =========================
  // EARLY LOGOUT (mins)
  // =========================
  let early_logout_mins = 0;

  if (punchOutTime && punchOutTime < officeEnd) {
    early_logout_mins = Math.floor(
      (officeEnd - punchOutTime) / (1000 * 60)
    );
  }

  // =========================
  // STATUS (NO LATE / HALF_DAY)
  // =========================
  let attendance_status = "ABSENT";

  if (punchInTime) {

    if (punchOutTime) {
      attendance_status = "PRESENT";

    } else if (now <= officeEnd) {
      attendance_status = "PRESENT";

    } else {
      attendance_status = "ABSENT";
    }
  }

  // =========================
  // CLEAN RESPONSE
  // =========================
  return {
  punch_in: formatIST(data.punch_in),
  punch_out: formatIST(data.punch_out),
  working_hours: workingHours,
  status:attendance_status,
  late_login_mins,
  early_logout_mins
};
};


// ========================================
// GET ATTENDANCE HISTORY
// ========================================
exports.getAttendanceHistory = async (userId, startDate, endDate) => {
  const rows = await repo.getAttendanceHistory(userId);

  const getISTDate = (date) => {
    return new Date(date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
  };

  const attendanceMap = {};
  rows.forEach((item) => {
    const baseDate = item.punch_in || item.date;
    if (!baseDate) return;
    const dateKey = getISTDate(baseDate);
    attendanceMap[dateKey] = item;
  });

  // ========================================
  // DYNAMIC DATE RANGE — use startDate/endDate if provided, else last 30 days
  // ========================================
  const today = new Date();
  const rangeStart = startDate
    ? new Date(startDate + "T00:00:00+05:30")
    : new Date(new Date().setDate(today.getDate() - 29));
  const rangeEnd = endDate
    ? new Date(endDate + "T23:59:59+05:30")
    : today;

  // Build array of dates in range
  const dateRange = [];
  const cursor = new Date(rangeStart);
  cursor.setHours(0, 0, 0, 0);
  while (cursor <= rangeEnd) {
    dateRange.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const result = [];
  for (const currentDate of dateRange) {
    const dateStr = getISTDate(currentDate);
    const dayName = currentDate.toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Asia/Kolkata",
    });
    const isSunday = dayName === "Sun";
    const data = attendanceMap[dateStr];

    // OFF DAY
    if (isSunday) {
      result.push({
        date: dateStr,
        status: "OFF",
        punch_in: null,
        punch_out: null,
        working_hours: "0.00",
        late_login_mins: 0,
        early_logout_mins: 0,
      });
      continue;
    }

    // ABSENT
    if (!data || data.attendance_status === "ABSENT") {
      result.push({
        date: dateStr,
        status: "ABSENT",
        punch_in: data?.punch_in ? formatIST(data.punch_in) : null,
        punch_out: null,
        working_hours: "0.00",
        late_login_mins: 0,
        early_logout_mins: 0,
      });
      continue;
    }

    const punchIn = data.punch_in ? new Date(data.punch_in) : null;
    const punchOut = data.punch_out ? new Date(data.punch_out) : null;
    const officeStart = getOfficeStart(data.punch_in);
    const officeEnd = getOfficeEnd(data.punch_in);

    let workingHours = "0.00";
    if (punchIn && punchOut) {
      const diff = punchOut - punchIn;
      workingHours = (diff / (1000 * 60 * 60)).toFixed(2);
    }

    let late_login_mins = 0;
    if (punchIn && punchIn > officeStart) {
      late_login_mins = Math.floor((punchIn - officeStart) / (1000 * 60));
    }

    let early_logout_mins = 0;
    if (punchOut && punchOut < officeEnd) {
      early_logout_mins = Math.max(0, Math.floor((officeEnd - punchOut) / (1000 * 60)));
    }

    let status = "ABSENT";
    if (punchIn) status = "PRESENT";

    result.push({
      date: dateStr,
      status,
      punch_in: data.punch_in ? formatIST(data.punch_in) : null,
      punch_out: data.punch_out ? formatIST(data.punch_out) : null,
      working_hours: workingHours,
      late_login_mins,
      early_logout_mins,
    });
  }

  return result;
};
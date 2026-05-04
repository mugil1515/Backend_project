// utils/attendanceCalc.util.js

exports.getLateMinutes = (punchIn) => {
  const inTime = new Date(punchIn);

  const officeStart = new Date(punchIn);
  officeStart.setHours(9, 30, 0, 0);

  const diff = inTime - officeStart;

  return diff > 0
    ? Math.floor(diff / 60000)
    : 0;
};


exports.getEarlyMinutes = (punchOut) => {
  const outTime = new Date(punchOut);

  const officeEnd = new Date(punchOut);
  officeEnd.setHours(18, 30, 0, 0);

  const diff = officeEnd - outTime;

  return diff > 0
    ? Math.floor(diff / 60000)
    : 0;
};
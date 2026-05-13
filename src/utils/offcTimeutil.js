const {
  OFFICE_START_HOUR,
  OFFICE_START_MINUTE,
  OFFICE_END_HOUR,
  OFFICE_END_MINUTE
} = require("../config/attendance.config");

const getOfficeStart = (refDate) => {
  const istStr = new Date(refDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  return new Date(`${istStr}T${String(OFFICE_START_HOUR).padStart(2,'0')}:${String(OFFICE_START_MINUTE).padStart(2,'0')}:00+05:30`);
};
const getOfficeEnd = (refDate) => {
  const istStr = new Date(refDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  return new Date(`${istStr}T${String(OFFICE_END_HOUR).padStart(2,'0')}:${String(OFFICE_END_MINUTE).padStart(2,'0')}:00+05:30`);
};

const formatIST = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
};

const formatDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

module.exports={getOfficeStart,getOfficeEnd,formatIST,formatDate}
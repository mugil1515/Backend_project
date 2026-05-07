const {
  OFFICE_START_HOUR,
  OFFICE_START_MINUTE,
  OFFICE_END_HOUR,
  OFFICE_END_MINUTE
} = require("../config/attendance.config");

const getOfficeStart = () => {
  const d = new Date();
  d.setHours(OFFICE_START_HOUR, OFFICE_START_MINUTE, 0, 0);
  return d;
};

const getOfficeEnd = () => {
  const d = new Date();
  d.setHours(OFFICE_END_HOUR, OFFICE_END_MINUTE, 0, 0);
  return d;
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
exports.getLateMinutes = (punchIn) => {
  const inTime = new Date(punchIn);
  const istStr = inTime.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const officeStart = new Date(`${istStr}T09:30:00+05:30`);
  const diff = inTime - officeStart;
  return diff > 0 ? Math.floor(diff / 60000) : 0;
};

exports.getEarlyMinutes = (punchOut) => {
  if (!punchOut) return 0;
  const outTime = new Date(punchOut);
  const istStr = outTime.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const officeEnd = new Date(`${istStr}T18:30:00+05:30`);
  const diff = officeEnd - outTime;
  return diff > 0 ? Math.floor(diff / 60000) : 0;
};
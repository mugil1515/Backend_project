
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
  if (!punchOut) return 0;

  const outTime = new Date(punchOut);

  // Force IST date anchor (prevents timezone drift issues)
  const officeEnd = new Date(
    outTime.getFullYear(),
    outTime.getMonth(),
    outTime.getDate(),
    18, 30, 0, 0
  );

  const diff = officeEnd.getTime() - outTime.getTime();

  return diff > 0 ? Math.floor(diff / 60000) : 0;
};
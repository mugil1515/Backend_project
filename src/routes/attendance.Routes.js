// routes/attendance.routes.js

const express = require("express");
const router = express.Router();

const attendanceController =
  require("../controllers/attendance.Controller");

const {authMiddleware} =
  require("../middlewares/authMiddleware");


// ========================================
// USER ROUTES
// ========================================


// Punch In
router.post(
  "/punch-in",
  authMiddleware,
  attendanceController.punchIn
);


// Punch Out
router.post(
  "/punch-out",
  authMiddleware,
  attendanceController.punchOut
);


// Today Attendance
router.get(
  "/attendance/today",
  authMiddleware,
  attendanceController.getTodayAttendance
);


// Attendance History
router.get(
  "/attendance/history",
  authMiddleware,
  attendanceController.getAttendanceHistory
);


module.exports = router;
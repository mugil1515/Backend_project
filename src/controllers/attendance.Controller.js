// controllers/attendance.controller.js

const attendanceService =
  require("../services/attendance.service");


// ========================================
// PUNCH IN CONTROLLER
// ========================================

exports.punchIn = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { latitude, longitude } = req.body;

    const result =
      await attendanceService.punchIn({
        userId,
        latitude,
        longitude
      });

    return res.status(200).json(result);

  } catch (error) {
    next(error); // pass to error middleware
  }
};


// ========================================
// PUNCH OUT CONTROLLER
// ========================================

exports.punchOut = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { latitude, longitude } = req.body;

    const result =
      await attendanceService.punchOut({
        userId,
        latitude,
        longitude
      });

    return res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};


// ========================================
// TODAY ATTENDANCE
// ========================================

exports.getTodayAttendance = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id;

    const data =
      await attendanceService.getTodayAttendance(
        userId
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// ATTENDANCE HISTORY
// ========================================

exports.getAttendanceHistory = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id;

    const data =
      await attendanceService.getAttendanceHistory(
        userId
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};
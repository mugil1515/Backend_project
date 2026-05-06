const attendanceService = require("../services/attendance.service");

// ========================================
// PUNCH IN
// ========================================

exports.punchIn = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await attendanceService.punchIn({

        userId: req.user.id,

        latitude:
          req.body.latitude,

        longitude:
          req.body.longitude
      });

    return res.status(201).json({

      success: true,

      message:
        result.message,

      data: result
    });

  } catch (error) {

    next(error);
  }
};


// ========================================
// PUNCH OUT
// ========================================

exports.punchOut = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await attendanceService.punchOut({

        userId: req.user.id,

        latitude:
          req.body.latitude,

        longitude:
          req.body.longitude
      });

    return res.status(200).json({

      success: true,

      message:
        result.message,

      data: result
    });

  } catch (error) {

    next(error);
  }
};


// ========================================
// GET TODAY ATTENDANCE
// ========================================

exports.getTodayAttendance =
  async (
    req,
    res,
    next
  ) => {

    try {

      const result =
        await attendanceService
          .getTodayAttendance(
            req.user.id
          );

      return res.status(200).json({

        success: true,

        data: result
      });

    } catch (error) {

      next(error);
    }
  };


// ========================================
// GET ATTENDANCE HISTORY
// ========================================

exports.getAttendanceHistory = async (
  req,
  res,
  next
) => {

  try {

    const data =
      await attendanceService.getAttendanceHistory(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    next(error);
  }
};
const adminService = require("../services/admin.Service");


// ==========================
// DASHBOARD
// ==========================

exports.getDashboard = async (req, res, next) => {

  try {

    const data = await adminService.getDashboard();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// TODAY ATTENDANCE
// ==========================

exports.getTodayAttendanceList = async (req, res, next) => {

  try {

    const data = await adminService.getTodayAttendanceList();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// ALL ATTENDANCE
// ==========================

exports.getAllAttendance = async (req, res, next) => {

  try {

    const data = await adminService.getAllAttendance(req.query);

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// SINGLE ATTENDANCE
// ==========================

exports.getAttendanceById = async (req, res, next) => {

  try {

    const data = await adminService.getAttendanceById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found"
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// UPDATE ATTENDANCE
// ==========================

exports.updateAttendance = async (req, res, next) => {

  try {

    const data = await adminService.updateAttendance(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Attendance updated",
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// USERS
// ==========================

exports.getAllUsers = async (req, res, next) => {

  try {

    const data = await adminService.getAllUsers();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// SINGLE USER
// ==========================

exports.getUserById = async (req, res, next) => {

  try {

    const data = await adminService.getUserById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// UPDATE USER
// ==========================
exports.updateUser = async (req, res, next) => {

  try {

    const id = req.params.id;

    const result = await adminService.updateUser(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });

  } catch (error) {
    next(error);
  }
};
// =======================================
// DELETE USER CONTROLLER
// =======================================

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const response = await adminService.deleteUser(userId);

    return res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};


// =======================================
// DELETE ATTENDANCE CONTROLLER
// =======================================

exports.deleteAttendance = async (req, res, next) => {
  try {
    const attendanceId = req.params.id;

    const response = await adminService.deleteAttendance(attendanceId);

    return res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};
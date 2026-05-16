const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.Controller");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// ==========================
// DASHBOARD
// ==========================
router.get(
  "/admin/dashboard",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getDashboard
);

// ==========================
// ATTENDANCE
// ==========================
router.get(
  "/admin/attendance/today",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getTodayAttendanceList
);


router.get(
  "/admin/attendance/monthly/:userId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getUserMonthlyAttendance
);

// ALL ATTENDANCE WITH FILTERS
router.get(
  "/admin/attendance",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getAllAttendance
);

router.get(
  "/admin/attendance/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getAttendanceById
);

router.put(
  "/admin/attendance/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.updateAttendance
);

// ==========================
// USERS
// ==========================
router.get(
  "/admin/users",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getAllUsers
);

router.get(
  "/admin/users/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getUserById
);

router.put(
  "/admin/users/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.updateUser
);

router.delete(
  "/delete/user/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.deleteUser
);

// ==========================
// ADMIN PROFILE
// ==========================
router.get(
  "/admin/profile",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getAdminProfile
);

router.put(
  "/admin/profile",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.updateAdmin
);

router.get(
  "/admin/attendance/history/:userId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  controller.getAttendanceHistory
);


module.exports = router;
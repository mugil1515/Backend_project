const express = require("express");

const router = express.Router();

const controller = require("../controllers/admin.Controller");

const authMiddleware= require("../middlewares/authMiddleware");

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
  controller.getTodayAttendance
);

router.get(
  "/admin/allattendance",
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

module.exports = router;
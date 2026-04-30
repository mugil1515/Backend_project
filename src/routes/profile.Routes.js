const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.Controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get(
  "/profile",
  authMiddleware,
  profileController.getProfile
);

router.get(
  "/admin/profile",
  authMiddleware,
  authorizeRoles("admin"),
  profileController.getProfile
);

module.exports = router;
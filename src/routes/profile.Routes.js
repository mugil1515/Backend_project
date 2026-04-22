const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/protectMiddleware");
const profileController = require("../controllers/profile.Controller");
const { sendResponse } = require("../middlewares/responseMiddleware");

// Protected profile route
router.get(
  "/profile",
  protect,
  profileController.getProfile,
  sendResponse
);

module.exports = router;
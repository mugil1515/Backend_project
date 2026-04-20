const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const userController = require("../controllers/profileController");

router.get("/profile", protect, userController.getProfile);

module.exports = router;
const express = require("express");
const router = express.Router();

const authController = require("../controllers/logout.Controller");
const { sendResponse } = require('../middlewares/responseMiddleware');

router.post("/logout", authController.logout, sendResponse);

module.exports = router;
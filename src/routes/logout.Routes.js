const express = require("express");
const router = express.Router();

const authController = require("../controllers/logout.Controller");

router.post("/logout", authController.logout);

module.exports = router;
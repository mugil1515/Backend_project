const express = require("express");
const router = express.Router();
const validate=require('../validators/userValidators');
const validationMiddleware=require('../middlewares/validationMiddleware');

const authController = require("../controllers/forgetpass.Controller");

router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-forgot-otp", authController.verifyForgotPasswordOTP);
router.post("/reset-password",validate.resetPasswordValidator,validationMiddleware, authController.resetPassword);


module.exports = router;
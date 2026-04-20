const express = require('express');
const router = express.Router();

const Controller = require('../controllers/verifyOTPController');
const validate = require('../middlewares/validationMiddleware');
const {verifyOtpValidator} = require('../validators/userValidators');

router.post('/verify-otp',verifyOtpValidator,validate,Controller.verifyOTP);
module.exports = router;
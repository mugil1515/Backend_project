const express = require('express');
const router = express.Router();

const Controller = require('../controllers/verifyOTP.Controller');
const validate = require('../middlewares/validationMiddleware');
const {verifyOtpValidator} = require('../validators/userValidators');
const { sendResponse } = require('../middlewares/responseMiddleware');

router.post('/verify-otp',verifyOtpValidator,validate,Controller.verifyOTPController,sendResponse);
module.exports = router;
const express = require('express');
const router = express.Router();

const Controller = require('../controllers/verifyOTP.Controller');
const validate = require('../middlewares/validationMiddleware');
const {verifyOtpValidator} = require('../../validators/userValidators');

router.post('/verify-otp',verifyOtpValidator,validate,Controller.verifyOTPController);
module.exports = router;
const express = require('express');
const router = express.Router();

const Controller = require('../controllers/otpController');
const validate = require('../middlewares/validationMiddleware');
const {otpValidator} = require('../validators/userValidators');

router.post('/send-otp',otpValidator,validate,Controller.sendOTP);
module.exports = router;
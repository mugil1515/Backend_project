const express = require('express');
const router = express.Router();

const Controller = require('../controllers/otp.Controller');
const validate = require('../middlewares/validationMiddleware');
const {otpValidator} = require('../validators/userValidators');

router.post('/send-otp',otpValidator,validate,Controller.sendOTP);
module.exports = router;
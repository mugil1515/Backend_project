const express = require('express');
const router = express.Router();

const Controller = require('../controllers/login.Controller');
const validate = require('../middlewares/validationMiddleware');
const {loginValidator} = require('../../validators/userValidators');

router.post('/login',loginValidator,validate,Controller.login);
module.exports = router;
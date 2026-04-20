const express = require('express');
const router = express.Router();

const Controller = require('../controllers/loginController');
const validate = require('../middlewares/validationMiddleware');
const {loginValidator} = require('../validators/userValidators');

router.post('/login',loginValidator,validate,Controller.login);
module.exports = router;
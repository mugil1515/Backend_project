const express = require('express');
const router = express.Router();

const Controller = require('../controllers/register.Controller');
const validate = require('../middlewares/validationMiddleware');
const {registerValidator} = require('../validators/userValidators');

router.post('/register',registerValidator,validate,Controller.register);
module.exports = router;
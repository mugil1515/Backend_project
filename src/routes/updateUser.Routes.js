const express = require('express');
const router = express.Router();

const Controller = require('../controllers/updateUser.Controller');
const validate = require('../middlewares/validationMiddleware');
const {updateProfileValidator} = require('../validators/userValidators');
const authMiddleware=require('../middlewares/authMiddleware')

router.put('/update/profile',authMiddleware,updateProfileValidator,validate,Controller.updateMyProfile);
module.exports = router;
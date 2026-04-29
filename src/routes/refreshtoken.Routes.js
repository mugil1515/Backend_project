const express = require("express");
const router = express.Router();

const refreshcontroller =require('../controllers/refreshtoken.Controller');

router.post('/refresh-token', refreshcontroller.refreshToken);

module.exports = router;
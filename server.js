const express = require('express');
const app = express();

require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');

const pool = require('./src/config/db');

// ==========================================
// CRON
// ==========================================

const startAutoAbsentCron = require('./src/cron/autoAbsent.cron');

// START CRON
startAutoAbsentCron();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ==========================================
// ROUTES
// ==========================================

const registerRoutes =
  require('./src/routes/register.Routes');

const loginRoutes =
  require('./src/routes/login.Routes');

const otpRoutes =
  require('./src/routes/otp.Routes');

const verifyOTPRoutes =
  require('./src/routes/verifyOTP.Routes');

const profileRoutes =
  require('./src/routes/profile.Routes');

const logoutRoutes =
  require('./src/routes/logout.Routes');

const forgetpassRoutes =
  require('./src/routes/forgetpass.Routes');

const refreshRoutes =
  require('./src/routes/refreshtoken.Routes');

const attendanceRoutes =
  require('./src/routes/attendance.Routes');

const adminRoutes =
  require('./src/routes/admin.Routes');

const updateUserRoutes =
  require('./src/routes/updateUser.Routes');

app.use('/api/v1', [
  registerRoutes,
  loginRoutes,
  otpRoutes,
  verifyOTPRoutes,
  profileRoutes,
  logoutRoutes,
 forgetpassRoutes,
  refreshRoutes,
  attendanceRoutes,
  adminRoutes,
  updateUserRoutes
]);

// ==========================================
// 404
// ==========================================

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "route_not_found"
  });

});

// ==========================================
// ERROR HANDLER
// ==========================================

const {
  errorHandler
} = require('./src/middlewares/errorMiddleware');

app.use(errorHandler);

// ==========================================
// SERVER
// ==========================================

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, () => {

  console.log(
    `🚀 Server running on PORT ${PORT}`
  );

});
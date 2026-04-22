const express = require('express');
const app = express();
require('dotenv').config();

const pool = require('./src/config/db');

const cookieParser = require('cookie-parser');
const cors = require('cors');

// ================= MIDDLEWARES =================

// 🔥 1. CORS FIRST
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 🔥 2. JSON + COOKIE PARSER
app.use(express.json());
app.use(cookieParser());

// ================= ROUTES =================
const registerRoutes = require('./src/routes/register.Routes');
const loginRoutes = require('./src/routes/login.Routes');
const otpRoutes = require('./src/routes/otp.Routes');
const verifyOTPRoutes = require('./src/routes/verifyOTP.Routes');
const profileRoutes = require('./src/routes/profile.Routes');
const logoutRoutes = require('./src/routes/logout.Routes');

app.use('/api/v1', registerRoutes);
app.use('/api/v1', loginRoutes);
app.use('/api/v1', otpRoutes);
app.use('/api/v1', verifyOTPRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1', logoutRoutes);

// ================= ERROR HANDLER =================
const { errorHandler } = require('./src/middlewares/errorMiddleware');
app.use(errorHandler);

// ================= SERVER =================
const http = require('http');
const server = http.createServer(app);

const PORT = process.env.PORT ;

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
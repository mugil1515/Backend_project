const express = require('express');
const app = express();
require('dotenv').config();

const pool = require('./src/config/db');

// 🔐 NEW: import cookie-parser & cors
const cookieParser = require('cookie-parser');
const cors = require('cors');

const registerRoutes = require('./src/routes/register.Routes');
const loginRoutes = require('./src/routes/login.Routes');
const otpRoutes = require('./src/routes/otp.Routes');
const verifyOTPRoutes = require('./src/routes/verifyOTP.Routes');
const profileRoutes = require('./src/routes/profile.Routes');

const http = require('http');
const server = http.createServer(app);

// ✅ DB Connection check
(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    console.log('✅ Database Connection Success');
  } catch (err) {
    console.log('❌ Database Connection Error:', err.message);
  }
})();

// 🔐 MIDDLEWARES
app.use(express.json());

// ✅ NEW: enable cookies
app.use(cookieParser());

// ✅ NEW: enable CORS with credentials
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true
}));

// ✅ Routes
app.use('/api/v1', registerRoutes, loginRoutes, otpRoutes, verifyOTPRoutes, profileRoutes);

// ✅ Error handler
const { errorHandler } = require('./src/middlewares/errorMiddleware');
app.use(errorHandler);

// ✅ Server
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
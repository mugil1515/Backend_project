const express = require('express');
const app = express();
require('dotenv').config();

const pool = require('./src/config/db');

const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const registerRoutes = require('./src/routes/register.Routes');
const loginRoutes = require('./src/routes/login.Routes');
const otpRoutes = require('./src/routes/otp.Routes');
const verifyOTPRoutes = require('./src/routes/verifyOTP.Routes');
const profileRoutes = require('./src/routes/profile.Routes');
const logoutRoutes = require('./src/routes/logout.Routes');
const forgetpassRoutes =require('./src/routes/forgetpass.Routes')

app.use('/api/v1', registerRoutes);
app.use('/api/v1', loginRoutes);
app.use('/api/v1', otpRoutes);
app.use('/api/v1', verifyOTPRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1', logoutRoutes);
app.use('/api/v1',forgetpassRoutes);

const { errorHandler } = require('./src/middlewares/errorMiddleware');
app.use(errorHandler);

const http = require('http');
const server = http.createServer(app);

const PORT = process.env.PORT ;

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
const express = require('express');
const app = express();
require('dotenv').config();
const pool=require('./src/config/db')
const registerRoutes= require('./src/routes/registerRoutes');
const loginRoutes=require('./src/routes/loginRoutes');
const otpRoutes=require('./src/routes/otpRoutes');
const verifyOTPRoutes=require('./src/routes/verifyOTPRoutes');

const http =require('http');
const server =http.createServer(app);

(async()=>{
    try{
        const connection = await pool.getConnection();

        await connection.ping();
        connection.release();

        console.log('✅ Database Connection Success')
    }catch(err){
        console.log('Data Base Connection Error:',err.message)
    }
})()

app.use(express.json());
app.use('/api/v1', registerRoutes,loginRoutes,otpRoutes,verifyOTPRoutes);
const {errorHandler} = require('./src/middlewares/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
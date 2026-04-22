const connection=require('mysql2/promise');

const pool=connection.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});
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
module.exports=pool;
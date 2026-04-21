const transporter = require('../config/mailer');

exports.sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html 
    });
  } catch (err) {
    console.error("Email Error:", err.message);
    throw new Error("Failed to send email");
  }
};
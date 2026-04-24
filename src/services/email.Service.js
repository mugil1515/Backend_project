const transporter = require("../config/mailer");

exports.sendEmail = async (to, subject, html, text = "") => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: text || "Please view this email in HTML format",
      html,
    });
  } catch (err) {
    console.error("Email Error:", err.message);
    throw new Error("Failed to send email");
  }
};
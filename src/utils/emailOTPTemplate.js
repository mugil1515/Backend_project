exports.otpEmailTemplate = (otp) => {
  return `
  <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">

    <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#4CAF50,#2E7D32);padding:20px;text-align:center;color:#fff;">
        <h1 style="margin:0;font-size:22px;">OTP Verification</h1>
        <p style="margin:5px 0 0;font-size:13px;">Secure Your Account Fast</p>
      </div>

      <!-- Body -->
      <div style="padding:30px;text-align:center;color:#333;">

        <h2 style="margin-bottom:10px;">Hello 👋</h2>

        <p style="font-size:14px;color:#666;">
          Use the OTP below to complete your verification. This OTP is valid for <b>5 minutes</b>.
        </p>

        <!-- OTP Box -->
        <div style="
          margin:25px auto;
          padding:15px 25px;
          font-size:28px;
          letter-spacing:8px;
          font-weight:bold;
          color:#2E7D32;
          background:#f1f8e9;
          border:2px dashed #4CAF50;
          display:inline-block;
          border-radius:8px;
        ">
          ${otp}
        </div>

        <p style="font-size:12px;color:#999;margin-top:20px;">
          If you did not request this, please ignore this email.
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#777;">
        © ${new Date().getFullYear()} RTH InfoTech. All rights reserved.
      </div>

    </div>
  </div>
  `;
};
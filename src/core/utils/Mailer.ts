import nodemailer from "nodemailer";

export async function sendOTPEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: process.env.SMTP_PASS?.trim(), 
    },
  });

  const username = email.split('@')[0];

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 40px 20px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <tr>
          <td align="center" style="background-color: #2b3e50; padding: 25px 20px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; letter-spacing: 1px;">MoneyTrack</h1>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #333333; font-size: 20px; font-weight: normal; margin-top: 0; margin-bottom: 24px;">Halo ${username},</h2>
            
            <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
              Kami menerima permintaan untuk sebuah aksi di akun Anda pada <b>MoneyTrack</b>. Untuk melanjutkan, masukkan kode verifikasi di bawah ini:
            </p>
            
            <!-- OTP Box -->
            <div style="background-color: #e2e8f0; border-radius: 4px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <span style="color: #1a202c; font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
            </div>
            
            <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
              Kode ini hanya berlaku selama <strong>5 menit</strong>. Jika Anda tidak meminta kode ini, abaikan email ini, dan pastikan akun Anda aman.
            </p>
            
            <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-top: 0; margin-bottom: 32px;">
              Untuk keamanan akun, jangan bagikan kode ini kepada siapa pun.
            </p>
            
            <p style="color: #555555; font-size: 14px; margin-top: 0; margin-bottom: 0;">
              MoneyTrack Indonesia.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const mailOptions = {
    from: `"MoneyTrack" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Kode Verifikasi MoneyTrack",
    text: `Kode verifikasi Anda adalah ${otp}`,
    html: htmlContent,
  };

  try {
    // Tambahkan trim() secara otomatis di kode untuk jaga-jaga spasi di .env
    console.log(`[SMTP] Final Check - User: ${process.env.SMTP_USER?.trim()}`);
    await transporter.sendMail(mailOptions);
    console.log("[SMTP] Success!");
  } catch (error: any) {
    console.error("[SMTP] Error Details:", error.message);
    throw error;
  }
}

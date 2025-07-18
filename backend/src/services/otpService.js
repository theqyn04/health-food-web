require('dotenv').config(); // Load environment variables
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure email transporter using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        ciphers: process.env.SMTP_TLS_CIPHERS
    }
});

// In-memory OTP storage
const otpStorage = new Map();

function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

async function sendOTP(email) {
    const otp = generateOTP();

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: email,
        subject: 'Your OTP Verification Code',
        text: `Your OTP code is: ${otp}\nThis code will expire in 5 minutes.`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">OTP Verification</h2>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 10px; display: inline-block; 
            font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">
          ${otp}
        </div>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        otpStorage.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send OTP' };
    }
}

function verifyOTP(email, otp) {
    const stored = otpStorage.get(email);
    if (!stored || stored.otp !== otp) return false;
    if (Date.now() > stored.expiresAt) {
        otpStorage.delete(email);
        return false;
    }
    otpStorage.delete(email);
    return true;
}

module.exports = {
    sendOTP,
    verifyOTP
};
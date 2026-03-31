const redis  = require('../../config/redis');
const { sendEmail } = require('../../config/email');
const { sendSMS }   = require('../../config/twilio');
const { auditService } = require('../audit/audit.service');

const OTP_TTL = 600; // 10 minutes in seconds

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendRegistrationOTP(userId, email, phone) {
  const otp = generateOTP();
  await redis.setEx(`otp:reg:${userId}`, OTP_TTL, otp);

  const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="color:#1a365d">Legal Aid Platform — Verify Your Account</h2>
      <p>Welcome! Use the code below to complete your registration:</p>
      <div style="background:#f0f4ff;border-radius:8px;padding:20px;text-align:center;margin:20px 0">
        <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#2b6cb0">${otp}</span>
      </div>
      <p style="color:#718096">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <p style="color:#e53e3e;font-size:12px">If you didn't create this account, ignore this email.</p>
    </div>`;

  const promises = [
    sendEmail({ to: email, subject: 'Your Legal Aid Platform verification code', html: emailHtml }),
  ];

  if (phone) {
    promises.push(sendSMS(phone, `Legal Aid Platform: Your verification code is ${otp}. Valid 10 minutes. Do not share.`));
  }

  await Promise.allSettled(promises);
  await auditService.log({ userId, eventType: 'otp_sent', eventCategory: 'auth', metadata: { email, hasPhone: !!phone } });

  return true;
}

async function verifyRegistrationOTP(userId, inputOtp) {
  const stored = await redis.get(`otp:reg:${userId}`);
  if (!stored) throw new Error('OTP expired or not found');
  if (stored !== inputOtp) {
    await auditService.log({ userId, eventType: 'otp_verify_failed', eventCategory: 'auth',
      severity: 'warning', success: false });
    throw new Error('Invalid OTP');
  }
  await redis.del(`otp:reg:${userId}`);
  await auditService.log({ userId, eventType: 'otp_verified', eventCategory: 'auth' });
  return true;
}

async function sendLoginOTP(userId, phone) {
  const otp = generateOTP();
  await redis.setEx(`otp:login:${userId}`, OTP_TTL, otp);
  await sendSMS(phone, `Legal Aid Platform login code: ${otp}. Expires in 10 minutes.`);
  return true;
}

async function verifyLoginOTP(userId, inputOtp) {
  const stored = await redis.get(`otp:login:${userId}`);
  if (!stored) throw new Error('OTP expired');
  if (stored !== inputOtp) throw new Error('Invalid OTP');
  await redis.del(`otp:login:${userId}`);
  return true;
}

module.exports = { sendRegistrationOTP, verifyRegistrationOTP, sendLoginOTP, verifyLoginOTP };

const bcrypt     = require('bcryptjs');
const crypto     = require('crypto');
const db         = require('../../config/database');
const redis      = require('../../config/redis');
const otpService = require('../otp/otp.service');
const tokenService   = require('../tokens/token.service');
const totpService    = require('../totp/totp.service');
const notifService   = require('../notifications/notification.service');
const { auditService }  = require('../audit/audit.service');
const { getClientIP, getDeviceInfo, getDeviceHash } = require('../../utils/device.utils');

async function register({ fullName, email, phone, password, role = 'litigant' }) {
  // Check existing
  const { rows: existing } = await db.query(`SELECT id FROM users WHERE email=$1`, [email]);
  if (existing.length) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await db.query(
    `INSERT INTO users(full_name, email, phone_number, password_hash, role)
     VALUES($1,$2,$3,$4,$5) RETURNING id`,
    [fullName, email, phone, passwordHash, role]
  );
  const userId = rows[0].id;

  await otpService.sendRegistrationOTP(userId, email, phone);
  await auditService.log({ userId, eventType: 'user_registered', eventCategory: 'auth', metadata: { email, role } });

  return { userId, message: 'Registration started. Check your email and SMS for OTP.' };
}

async function verifyRegistration(userId, otp) {
  await otpService.verifyRegistrationOTP(userId, otp);
  await db.query(`UPDATE users SET is_email_verified=TRUE WHERE id=$1`, [userId]);
  await auditService.log({ userId, eventType: 'email_verified', eventCategory: 'auth' });
  return { message: 'Account verified successfully' };
}

async function login({ email, password, totpToken, smsOtp }, req) {
  const ip         = getClientIP(req);
  const deviceInfo = getDeviceInfo(req);
  const deviceHash = getDeviceHash(req);

  const { rows } = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (!rows.length) throw new Error('Invalid credentials');

  const user = rows[0];

  // Account lockout
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const waitMin = Math.ceil((new Date(user.locked_until) - Date.now()) / 60000);
    throw new Error(`Account locked. Try again in ${waitMin} minutes.`);
  }

  if (!user.is_active) throw new Error('Account deactivated');

  const passwordOk = await bcrypt.compare(password, user.password_hash);
  if (!passwordOk) {
    const attempts = user.failed_login_attempts + 1;
    let lockedUntil = null;
    if (attempts >= 5) lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    await db.query(
      `UPDATE users SET failed_login_attempts=$1, locked_until=$2 WHERE id=$3`,
      [attempts, lockedUntil, user.id]
    );
    await auditService.log({ userId: user.id, eventType: 'login_failed', eventCategory: 'auth',
      ipAddress: ip, userAgent: req.headers['user-agent'], severity: 'warning', success: false,
      metadata: { attempts } });
    throw new Error('Invalid credentials');
  }

  // Admin TOTP check
  if (user.role === 'admin' && user.totp_enabled) {
    if (!totpToken) throw new Error('TOTP token required for admin login');
    const totpValid = await totpService.verifyTOTP(user.id, totpToken);
    if (!totpValid) {
      // Allow backup code
      const backupValid = await tokenService.useBackupCode(user.id, totpToken);
      if (!backupValid) {
        await auditService.log({ userId: user.id, eventType: 'totp_verify_failed', eventCategory: 'auth',
          severity: 'critical', success: false, ipAddress: ip });
        throw new Error('Invalid TOTP token or backup code');
      }
    }
  }

  // Check for new device
  const { rows: knownDevices } = await db.query(
    `SELECT * FROM known_devices WHERE user_id=$1 AND device_hash=$2`,
    [user.id, deviceHash]
  );
  const isNewDevice = knownDevices.length === 0;

  if (isNewDevice) {
    await db.query(
      `INSERT INTO known_devices(user_id, device_hash, browser, os, ip_address)
       VALUES($1,$2,$3,$4,$5)`,
      [user.id, deviceHash, deviceInfo.browser, deviceInfo.os, ip]
    );
    await notifService.notifyNewDeviceLogin(user.id, ip, deviceInfo.browser, deviceInfo.os);
  } else {
    await db.query(
      `UPDATE known_devices SET last_seen=NOW(), ip_address=$1 WHERE user_id=$2 AND device_hash=$3`,
      [ip, user.id, deviceHash]
    );
  }

  // Reset failed attempts
  await db.query(
    `UPDATE users SET failed_login_attempts=0, locked_until=NULL, last_login_at=NOW(),
     last_login_ip=$1, login_count=login_count+1 WHERE id=$2`,
    [ip, user.id]
  );

  const accessToken  = tokenService.generateAccessToken(user.id, user.role);
  const refreshToken = await tokenService.generateRefreshToken(user.id, deviceInfo, ip);

  await auditService.log({ userId: user.id, eventType: 'login_success', eventCategory: 'auth',
    ipAddress: ip, userAgent: req.headers['user-agent'],
    metadata: { role: user.role, isNewDevice } });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role,
            isEmailVerified: user.is_email_verified, totpEnabled: user.totp_enabled },
  };
}

async function refreshTokens(oldToken, req) {
  const ip         = getClientIP(req);
  const deviceInfo = getDeviceInfo(req);
  return tokenService.rotateRefreshToken(oldToken, deviceInfo, ip);
}

async function logout(userId, refreshToken) {
  const crypto = require('crypto');
  const hash   = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await db.query(`UPDATE refresh_tokens SET revoked=TRUE, revoked_at=NOW() WHERE token_hash=$1`, [hash]);
  await auditService.log({ userId, eventType: 'logout', eventCategory: 'auth' });
}

module.exports = { register, verifyRegistration, login, refreshTokens, logout };

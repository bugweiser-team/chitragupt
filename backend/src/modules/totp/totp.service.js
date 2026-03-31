const speakeasy  = require('speakeasy');
const QRCode     = require('qrcode');
const db         = require('../../config/database');
const { encrypt, decrypt } = require('../../utils/crypto.utils');
const { generateBackupCodes } = require('../tokens/token.service');
const { auditService } = require('../audit/audit.service');

async function setupTOTP(userId, email) {
  const secret = speakeasy.generateSecret({
    name:   `LegalAid:${email}`,
    issuer: 'Legal Aid Platform',
    length: 20,
  });

  const encryptedSecret = encrypt(secret.base32);
  await db.query(`UPDATE users SET totp_secret=$1 WHERE id=$2`, [encryptedSecret, userId]);

  const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
  return { qrDataUrl, backupUri: secret.otpauth_url };
}

async function enableTOTP(userId, token) {
  const { rows } = await db.query(`SELECT totp_secret FROM users WHERE id=$1`, [userId]);
  if (!rows.length || !rows[0].totp_secret) throw new Error('TOTP not set up');

  const secret   = decrypt(rows[0].totp_secret);
  const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 2 });
  if (!verified) {
    await auditService.log({ userId, eventType: 'totp_enable_failed', eventCategory: 'security',
      severity: 'warning', success: false });
    throw new Error('Invalid TOTP token');
  }

  await db.query(`UPDATE users SET totp_enabled=TRUE WHERE id=$1`, [userId]);
  const backupCodes = await generateBackupCodes(userId);
  await auditService.log({ userId, eventType: 'totp_enabled', eventCategory: 'security' });
  return { backupCodes };
}

async function verifyTOTP(userId, token) {
  const { rows } = await db.query(
    `SELECT totp_secret, totp_enabled FROM users WHERE id=$1`,
    [userId]
  );
  if (!rows.length || !rows[0].totp_enabled) return false;

  const secret = decrypt(rows[0].totp_secret);
  return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 2 });
}

async function disableTOTP(userId) {
  await db.query(`UPDATE users SET totp_enabled=FALSE, totp_secret=NULL WHERE id=$1`, [userId]);
  await db.query(`DELETE FROM backup_codes WHERE user_id=$1`, [userId]);
  await auditService.log({ userId, eventType: 'totp_disabled', eventCategory: 'security', severity: 'warning' });
}

module.exports = { setupTOTP, enableTOTP, verifyTOTP, disableTOTP };

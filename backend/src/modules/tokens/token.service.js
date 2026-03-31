const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const db      = require('../../config/database');
const redis   = require('../../config/redis');
require('dotenv').config();

function generateAccessToken(userId, role) {
  return jwt.sign({ userId, role, type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
  });
}

async function generateRefreshToken(userId, deviceInfo, ipAddress) {
  const token    = crypto.randomBytes(64).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.query(
    `INSERT INTO refresh_tokens(user_id, token_hash, device_info, ip_address, expires_at)
     VALUES($1,$2,$3,$4,$5)`,
    [userId, tokenHash, JSON.stringify(deviceInfo), ipAddress, expiresAt]
  );
  return token;
}

async function rotateRefreshToken(oldToken, deviceInfo, ipAddress) {
  const oldHash = crypto.createHash('sha256').update(oldToken).digest('hex');

  const { rows } = await db.query(
    `SELECT * FROM refresh_tokens WHERE token_hash=$1 AND revoked=FALSE AND expires_at > NOW()`,
    [oldHash]
  );
  if (!rows.length) throw new Error('Invalid or expired refresh token');

  // Revoke old token
  await db.query(`UPDATE refresh_tokens SET revoked=TRUE, revoked_at=NOW() WHERE token_hash=$1`, [oldHash]);

  const { userId } = rows[0];
  const { rows: userRows } = await db.query(`SELECT role FROM users WHERE id=$1`, [userId]);
  const newAccessToken  = generateAccessToken(userId, userRows[0]?.role);
  const newRefreshToken = await generateRefreshToken(userId, deviceInfo, ipAddress);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, userId };
}

async function revokeAllUserTokens(userId) {
  await db.query(
    `UPDATE refresh_tokens SET revoked=TRUE, revoked_at=NOW()
     WHERE user_id=$1 AND revoked=FALSE`,
    [userId]
  );
}

async function generateBackupCodes(userId) {
  const codes  = Array.from({ length: 8 }, () => crypto.randomBytes(4).toString('hex'));
  const hashes = await Promise.all(codes.map(c => bcrypt.hash(c, 10)));

  // Delete old codes first
  await db.query(`DELETE FROM backup_codes WHERE user_id=$1`, [userId]);

  // Insert new ones
  for (const hash of hashes) {
    await db.query(
      `INSERT INTO backup_codes(user_id, code_hash) VALUES($1,$2)`,
      [userId, hash]
    );
  }
  return codes; // Return plaintext ONCE
}

async function useBackupCode(userId, inputCode) {
  const { rows } = await db.query(
    `SELECT * FROM backup_codes WHERE user_id=$1 AND used=FALSE`,
    [userId]
  );
  for (const row of rows) {
    const match = await bcrypt.compare(inputCode, row.code_hash);
    if (match) {
      await db.query(
        `UPDATE backup_codes SET used=TRUE, used_at=NOW() WHERE id=$1`,
        [row.id]
      );
      return true;
    }
  }
  return false;
}

module.exports = { generateAccessToken, generateRefreshToken, rotateRefreshToken,
                   revokeAllUserTokens, generateBackupCodes, useBackupCode };

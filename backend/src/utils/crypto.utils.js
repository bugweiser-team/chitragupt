const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const ALGORITHM  = 'aes-256-cbc';
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(data) {
  const [ivHex, encHex] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

async function hashValue(value) {
  return bcrypt.hash(value, 12);
}

async function compareHash(value, hash) {
  return bcrypt.compare(value, hash);
}

function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { encrypt, decrypt, hashValue, compareHash, generateSecureToken, hashToken };

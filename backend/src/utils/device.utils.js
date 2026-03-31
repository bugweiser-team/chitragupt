const crypto = require('crypto');
const UAParser = require('ua-parser-js');

function getDeviceInfo(req) {
  const ua = req.headers['user-agent'] || '';
  const parser = new UAParser(ua);
  const result = parser.getResult();
  return {
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os:      `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    device:  result.device.type || 'desktop',
    raw:     ua,
  };
}

function getDeviceHash(req) {
  const ua = req.headers['user-agent'] || '';
  const ip = getClientIP(req);
  return crypto.createHash('sha256').update(`${ua}:${ip}`).digest('hex');
}

function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    '0.0.0.0'
  );
}

module.exports = { getDeviceInfo, getDeviceHash, getClientIP };

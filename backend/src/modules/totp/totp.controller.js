const totpService = require('./totp.service');
const { successResponse, errorResponse } = require('../../utils/response.utils');

async function setup(req, res) {
  try {
    const result = await totpService.setupTOTP(req.user.id, req.user.email);
    return successResponse(res, result, 'Scan QR code with Google Authenticator or Authy');
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
}

async function enable(req, res) {
  try {
    const { token } = req.body;
    if (!token) return errorResponse(res, 'TOTP token required', 400);
    const result = await totpService.enableTOTP(req.user.id, token);
    return successResponse(res, result, '2FA enabled. Save your backup codes!');
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
}

async function disable(req, res) {
  try {
    await totpService.disableTOTP(req.user.id);
    return successResponse(res, {}, '2FA disabled');
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
}

module.exports = { setup, enable, disable };

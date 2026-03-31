const authService = require('./auth.service');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../../utils/response.utils');

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 422, errors.array());
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, result.message, 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
}

async function verifyOTP(req, res) {
  const { userId, otp } = req.body;
  if (!userId || !otp) return errorResponse(res, 'userId and otp required', 400);
  try {
    const result = await authService.verifyRegistration(userId, otp);
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 422, errors.array());
  try {
    const result = await authService.login(req.body, req);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });
    return successResponse(res, { accessToken: result.accessToken, user: result.user });
  } catch (err) {
    return errorResponse(res, err.message, 401);
  }
}

async function refreshTokens(req, res) {
  const oldToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!oldToken) return errorResponse(res, 'Refresh token required', 401);
  try {
    const result = await authService.refreshTokens(oldToken, req);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return successResponse(res, { accessToken: result.accessToken });
  } catch (err) {
    return errorResponse(res, err.message, 401);
  }
}

async function logout(req, res) {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  await authService.logout(req.user?.id, token).catch(() => {});
  res.clearCookie('refreshToken');
  return successResponse(res, {}, 'Logged out successfully');
}

module.exports = { register, verifyOTP, login, refreshTokens, logout };

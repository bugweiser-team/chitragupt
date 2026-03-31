const jwt = require('jsonwebtoken');
const db  = require('../config/database');
const { errorResponse } = require('../utils/response.utils');
require('dotenv').config();

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse(res, 'Access token required', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'access') return errorResponse(res, 'Invalid token type', 401);

    const { rows } = await db.query(
      'SELECT id, full_name, email, role, is_active FROM users WHERE id=$1',
      [decoded.userId]
    );
    if (!rows.length || !rows[0].is_active) {
      return errorResponse(res, 'User not found or deactivated', 401);
    }
    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return errorResponse(res, 'Access token expired', 401);
    if (err.name === 'JsonWebTokenError') return errorResponse(res, 'Invalid access token', 401);
    return errorResponse(res, 'Authentication failed', 500);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return errorResponse(res, 'Not authenticated', 401);
    if (!roles.includes(req.user.role)) return errorResponse(res, 'Insufficient permissions', 403);
    next();
  };
}

module.exports = { authenticate, requireRole };

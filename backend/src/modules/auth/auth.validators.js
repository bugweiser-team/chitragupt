const { body } = require('express-validator');
const zxcvbn  = require('zxcvbn');

const registerValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name required').isLength({ min: 2, max: 100 }),
  body('email').normalizeEmail().isEmail().withMessage('Valid email required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .custom((value) => {
      const result = zxcvbn(value);
      if (result.score < 2) throw new Error('Password too weak. Use uppercase, numbers, and symbols.');
      return true;
    }),
  body('role').optional().isIn(['litigant', 'lawyer']).withMessage('Invalid role'),
];

const loginValidator = [
  body('email').normalizeEmail().isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

const otpValidator = [
  body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('Valid 6-digit OTP required'),
];

module.exports = { registerValidator, loginValidator, otpValidator };

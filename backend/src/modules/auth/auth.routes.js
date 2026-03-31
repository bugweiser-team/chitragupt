const router = require('express').Router();
const authController = require('./auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authLimiter, otpLimiter } = require('../../middleware/rateLimit.middleware');
const { registerValidator, loginValidator } = require('./auth.validators');

router.post('/register',      authLimiter, registerValidator, authController.register);
router.post('/verify-otp',    otpLimiter,  authController.verifyOTP);
router.post('/login',         authLimiter, loginValidator,    authController.login);
router.post('/refresh',       authController.refreshTokens);
router.post('/logout',        authenticate, authController.logout);

module.exports = router;

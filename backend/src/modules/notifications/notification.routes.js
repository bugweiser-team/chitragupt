const router = require('express').Router();
const { authenticate } = require('../../middleware/auth.middleware');
const db  = require('../../config/database');
const { successResponse } = require('../../utils/response.utils');

// Register FCM token
router.post('/register-fcm', authenticate, async (req, res) => {
  const { fcmToken } = req.body;
  await db.query(`UPDATE users SET fcm_token=$1 WHERE id=$2`, [fcmToken, req.user.id]);
  return successResponse(res, {}, 'FCM token registered');
});

// Register Web Push subscription
router.post('/register-webpush', authenticate, async (req, res) => {
  const { subscription } = req.body;
  await db.query(`UPDATE users SET web_push_subscription=$1 WHERE id=$2`,
    [JSON.stringify(subscription), req.user.id]);
  return successResponse(res, {}, 'Web Push subscription registered');
});

// Get VAPID public key
router.get('/vapid-public-key', (req, res) => {
  res.json({ key: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;

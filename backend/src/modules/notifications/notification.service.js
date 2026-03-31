const admin   = require('../../config/firebase');
const webpush = require('../../config/webpush');
const db      = require('../../config/database');
const logger  = require('../../utils/logger');

const NotificationType = {
  NEW_DEVICE_LOGIN:      'new_device_login',
  DOCUMENT_ACCESSED:     'document_accessed',
  CASE_STATUS_CHANGE:    'case_status_change',
  SUSPICIOUS_ACCESS:     'suspicious_access',
  SECURITY_ALERT:        'security_alert',
  ADMIN_SECURITY_ALERT:  'admin_security_alert',
};

async function sendFCM(fcmToken, title, body, data = {}) {
  if (!fcmToken) return { success: false, reason: 'no_token' };
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: { ...data, timestamp: Date.now().toString() },
      android: { priority: 'high', notification: { sound: 'default', channelId: 'security_alerts' } },
      apns:    { payload: { aps: { sound: 'default', badge: 1 } } },
    });
    return { success: true };
  } catch (err) {
    logger.error('[FCM] Send failed:', err.message);
    return { success: false, reason: err.message };
  }
}

async function sendWebPush(subscription, title, body, data = {}) {
  if (!subscription) return { success: false, reason: 'no_subscription' };
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body, data, icon: '/icons/icon-192x192.png' })
    );
    return { success: true };
  } catch (err) {
    logger.error('[WebPush] Send failed:', err.message);
    return { success: false, reason: err.message };
  }
}

async function notifyUser(userId, title, body, type, data = {}) {
  const { rows } = await db.query(
    `SELECT fcm_token, web_push_subscription FROM users WHERE id=$1`,
    [userId]
  );
  if (!rows.length) return;

  const { fcm_token, web_push_subscription } = rows[0];
  const results = await Promise.allSettled([
    sendFCM(fcm_token, title, body, data),
    sendWebPush(web_push_subscription, title, body, data),
  ]);

  await db.query(
    `INSERT INTO notification_log(user_id, title, body, type, channel, delivered)
     VALUES($1,$2,$3,$4,$5,$6)`,
    [userId, title, body, type, 'multi',
     results.some(r => r.status === 'fulfilled' && r.value?.success)]
  );
}

async function notifyNewDeviceLogin(userId, ipAddress, browser, os) {
  await notifyUser(
    userId,
    '⚠ New device login detected',
    `Your account was accessed from ${browser} on ${os} (IP: ${ipAddress})`,
    NotificationType.NEW_DEVICE_LOGIN,
    { type: 'security', ipAddress }
  );
}

async function notifyDocumentAccess(ownerId, accessorName, docName) {
  await notifyUser(
    ownerId,
    '📄 Document accessed',
    `"${docName}" was viewed by ${accessorName}`,
    NotificationType.DOCUMENT_ACCESSED,
    { type: 'document' }
  );
}

async function notifySuspiciousActivity(userId, reason, ipAddress) {
  await notifyUser(
    userId,
    '🚨 Suspicious activity detected',
    `${reason} from IP ${ipAddress}. If this wasn't you, change your password immediately.`,
    NotificationType.SUSPICIOUS_ACCESS,
    { type: 'security', critical: 'true', ipAddress }
  );
}

async function notifyAllAdmins(title, body, data = {}) {
  const { rows } = await db.query(
    `SELECT id FROM users WHERE role='admin' AND is_active=TRUE`
  );
  await Promise.all(rows.map(r => notifyUser(r.id, title, body, NotificationType.ADMIN_SECURITY_ALERT, data)));
}

module.exports = { notifyUser, notifyNewDeviceLogin, notifyDocumentAccess,
                   notifySuspiciousActivity, notifyAllAdmins, NotificationType };

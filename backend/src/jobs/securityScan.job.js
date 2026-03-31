const cron   = require('node-cron');
const logger = require('../utils/logger');
const { runFullScan } = require('../modules/scanner/scanner.service');

function initSecurityScanJob() {
  // Run every Sunday at 2:00 AM
  cron.schedule('0 2 * * 0', async () => {
    logger.info('[Job] Weekly security scan starting');
    try {
      await runFullScan();
      logger.info('[Job] Weekly security scan completed');
    } catch (err) {
      logger.error('[Job] Weekly security scan failed:', err);
    }
  });

  // Cleanup expired Redis OTPs every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('[Job] OTP cleanup (Redis TTL handles this automatically)');
  });

  // Cleanup expired refresh tokens daily at 3 AM
  cron.schedule('0 3 * * *', async () => {
    const db = require('../config/database');
    try {
      const { rowCount } = await db.query(
        `DELETE FROM refresh_tokens WHERE expires_at < NOW() OR revoked=TRUE`
      );
      logger.info(`[Job] Cleaned up ${rowCount} expired refresh tokens`);
    } catch (err) {
      logger.error('[Job] Token cleanup failed:', err);
    }
  });

  logger.info('[Jobs] All scheduled jobs initialized');
}

module.exports = { initSecurityScanJob };

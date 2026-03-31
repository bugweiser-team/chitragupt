const { auditService } = require('../modules/audit/audit.service');
const { getClientIP }  = require('../utils/device.utils');

function auditRequest(eventType, category = 'api', severity = 'info') {
  return async (req, res, next) => {
    const startTime = Date.now();
    const originalEnd = res.end;

    res.end = function (...args) {
      const duration = Date.now() - startTime;
      auditService.log({
        userId:        req.user?.id,
        eventType,
        eventCategory: category,
        ipAddress:     getClientIP(req),
        userAgent:     req.headers['user-agent'],
        severity:      res.statusCode >= 400 ? 'warning' : severity,
        success:       res.statusCode < 400,
        metadata: {
          method:     req.method,
          path:       req.path,
          statusCode: res.statusCode,
          duration,
        },
      }).catch(() => {});
      originalEnd.apply(this, args);
    };
    next();
  };
}

module.exports = { auditRequest };

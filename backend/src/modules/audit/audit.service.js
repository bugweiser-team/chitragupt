const db     = require('../../config/database');
const logger = require('../../utils/logger');

const auditService = {
  async log({ userId = null, adminId = null, eventType, eventCategory = 'general',
              ipAddress = null, userAgent = null, resourceType = null,
              resourceId = null, metadata = {}, severity = 'info',
              success = true, errorMessage = null }) {
    try {
      await db.query(
        `INSERT INTO audit_logs
          (user_id, admin_id, event_type, event_category, ip_address, user_agent,
           resource_type, resource_id, metadata, severity, success, error_message)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [userId, adminId, eventType, eventCategory, ipAddress, userAgent,
         resourceType, resourceId, JSON.stringify(metadata), severity, success, errorMessage]
      );
    } catch (err) {
      logger.error('[AuditService] Failed to write log:', err);
    }
  },

  async getLogs({ userId, eventType, severity, startDate, endDate, page = 1, limit = 50 }) {
    const conditions = ['1=1'];
    const params = [];
    let i = 1;

    if (userId)    { conditions.push(`user_id = $${i++}`);        params.push(userId); }
    if (eventType) { conditions.push(`event_type = $${i++}`);     params.push(eventType); }
    if (severity)  { conditions.push(`severity = $${i++}`);       params.push(severity); }
    if (startDate) { conditions.push(`created_at >= $${i++}`);    params.push(startDate); }
    if (endDate)   { conditions.push(`created_at <= $${i++}`);    params.push(endDate); }

    const offset = (page - 1) * limit;
    const where  = conditions.join(' AND ');

    const [dataResult, countResult] = await Promise.all([
      db.query(
        `SELECT l.*, u.full_name, u.email FROM audit_logs l
         LEFT JOIN users u ON l.user_id = u.id
         WHERE ${where} ORDER BY l.created_at DESC
         LIMIT $${i} OFFSET $${i + 1}`,
        [...params, limit, offset]
      ),
      db.query(`SELECT COUNT(*) FROM audit_logs WHERE ${where}`, params),
    ]);

    return {
      logs:  dataResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    };
  },
};

module.exports = { auditService };

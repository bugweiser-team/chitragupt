const xss = require('xss');

// WAF-style request scanner
function wafMiddleware(req, res, next) {
  const suspicious = [
    /(\.\.|%2e%2e|%252e)/i,          // Path traversal
    /<script[\s\S]*?>[\s\S]*?<\/script>/i,  // XSS script tags
    /(\bUNION\b.*\bSELECT\b|\bSELECT\b.*\bFROM\b|\bDROP\b.*\bTABLE\b|\bINSERT\b.*\bINTO\b|\bDELETE\b.*\bFROM\b)/i, // SQLi
    /(\bOR\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?)/i,  // SQLi OR 1=1
    /(javascript:|vbscript:|data:text\/html)/i,          // Protocol injection
    /(\bEXEC\b|\bEXECUTE\b|\bxp_cmdshell\b)/i,         // Command injection
  ];

  const checkValue = (val) => {
    if (typeof val === 'string') {
      for (const pattern of suspicious) {
        if (pattern.test(val)) return true;
      }
    }
    return false;
  };

  const checkObject = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    for (const key of Object.keys(obj)) {
      if (checkValue(key) || checkValue(obj[key])) return true;
      if (typeof obj[key] === 'object' && checkObject(obj[key])) return true;
    }
    return false;
  };

  const urlSuspicious = checkValue(req.url) || checkValue(decodeURIComponent(req.url));
  const bodySuspicious = checkObject(req.body);
  const querySuspicious = checkObject(req.query);

  if (urlSuspicious || bodySuspicious || querySuspicious) {
    const { auditService } = require('../modules/audit/audit.service');
    auditService.log({
      eventType:     'waf_block',
      eventCategory: 'security',
      ipAddress:     req.ip,
      userAgent:     req.headers['user-agent'],
      severity:      'critical',
      success:       false,
      metadata: {
        url:          req.url,
        method:       req.method,
        blockedReason: urlSuspicious ? 'url' : bodySuspicious ? 'body' : 'query',
      },
    }).catch(() => {});
    return res.status(400).json({ success: false, message: 'Invalid request blocked' });
  }

  // Sanitize body values
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj) => {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') obj[key] = xss(obj[key]);
        else if (typeof obj[key] === 'object') sanitize(obj[key]);
      }
    };
    sanitize(req.body);
  }

  next();
}

// CORS options
function getCorsOptions() {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
  ].filter(Boolean);

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials:         true,
    methods:             ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders:      ['Content-Type', 'Authorization', 'X-Device-ID'],
    exposedHeaders:      ['X-New-Access-Token'],
    optionsSuccessStatus: 200,
  };
}

module.exports = { wafMiddleware, getCorsOptions };

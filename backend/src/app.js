require('express-async-errors');
require('dotenv').config();

const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const morgan    = require('morgan');
const cookieParser = require('cookie-parser');
const compression  = require('compression');
const hpp          = require('hpp');

const { wafMiddleware, getCorsOptions } = require('./middleware/security.middleware');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const logger = require('./utils/logger');

// Routes
const authRoutes         = require('./modules/auth/auth.routes');
const totpRoutes         = require('./modules/totp/totp.routes');
const auditRoutes        = require('./modules/audit/audit.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const scannerRoutes      = require('./modules/scanner/scanner.routes');

// Jobs
const { initSecurityScanJob } = require('./jobs/securityScan.job');

const app = express();

// ─── TRUST PROXY ───
app.set('trust proxy', 1);

// ─── CORE SECURITY HEADERS ───
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'", "'unsafe-inline'"],
      styleSrc:       ["'self'", "'unsafe-inline'"],
      imgSrc:         ["'self'", 'data:'],
      connectSrc:     ["'self'"],
      fontSrc:        ["'self'"],
      objectSrc:      ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ─── CORS ───
app.use(cors(getCorsOptions()));

// ─── BODY PARSING ───
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());
app.use(hpp());

// ─── LOGGING ───
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// ─── WAF MIDDLEWARE ───
app.use(wafMiddleware);

// ─── RATE LIMITING ───
app.use('/api', generalLimiter);

// ─── ROUTES ───
app.use('/api/auth',          authRoutes);
app.use('/api/auth/totp',     totpRoutes);
app.use('/api/admin/logs',    auditRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/scanner', scannerRoutes);

// ─── HEALTH CHECK ───
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ─── GLOBAL ERROR HANDLER ───
app.use((err, req, res, next) => {
  logger.error('[GlobalError]', { message: err.message, stack: err.stack, path: req.path });
  if (err.message?.includes('CORS')) return res.status(403).json({ success: false, message: 'CORS blocked' });
  res.status(err.status || 500).json({ success: false, message: process.env.NODE_ENV === 'production'
    ? 'An error occurred' : err.message });
});

// ─── 404 HANDLER ───
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── START SERVER ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  initSecurityScanJob();
});

module.exports = app;

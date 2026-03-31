const router = require('express').Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const scannerController = require('./scanner.controller');

router.use(authenticate, requireRole('admin'));
router.post('/run',     scannerController.triggerScan);
router.get('/reports',  scannerController.getReports);

module.exports = router;

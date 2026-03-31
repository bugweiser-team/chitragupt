const router = require('express').Router();
const { authenticate, requireRole } = require('../../middleware/auth.middleware');
const { getLogs, exportCSV, exportPDF } = require('./audit.controller');

router.use(authenticate, requireRole('admin'));
router.get('/',           getLogs);
router.get('/export/csv', exportCSV);
router.get('/export/pdf', exportPDF);

module.exports = router;

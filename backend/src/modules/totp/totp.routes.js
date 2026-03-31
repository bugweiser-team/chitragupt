const router = require('express').Router();
const { authenticate } = require('../../middleware/auth.middleware');
const totpController   = require('./totp.controller');

router.use(authenticate);
router.post('/setup',   totpController.setup);
router.post('/enable',  totpController.enable);
router.post('/disable', totpController.disable);

module.exports = router;

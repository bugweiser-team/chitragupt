const scannerService = require('./scanner.service');
const { successResponse, errorResponse } = require('../../utils/response.utils');

async function triggerScan(req, res) {
  try {
    res.json({ success: true, message: 'Security scan started. Results will appear in the dashboard.' });
    scannerService.runFullScan().catch(() => {});
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

async function getReports(req, res) {
  try {
    const reports = await scannerService.getLatestReports(10);
    return successResponse(res, { reports });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch reports', 500);
  }
}

module.exports = { triggerScan, getReports };

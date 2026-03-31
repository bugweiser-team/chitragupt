const { auditService }  = require('./audit.service');
const { successResponse, errorResponse } = require('../../utils/response.utils');
const PDFDocument = require('pdfkit');
const { Parser }  = require('json2csv');
const moment      = require('moment');

async function getLogs(req, res) {
  try {
    const { userId, eventType, severity, startDate, endDate, page, limit } = req.query;
    const result = await auditService.getLogs({ userId, eventType, severity, startDate, endDate,
      page: parseInt(page) || 1, limit: parseInt(limit) || 50 });
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch logs', 500);
  }
}

async function exportCSV(req, res) {
  try {
    const result = await auditService.getLogs({ ...req.query, limit: 10000 });
    const fields  = ['id','event_type','event_category','severity','ip_address','full_name','email','created_at'];
    const parser  = new Parser({ fields });
    const csv     = parser.parse(result.logs);
    res.header('Content-Type', 'text/csv');
    res.attachment(`audit_log_${moment().format('YYYY-MM-DD')}.csv`);
    res.send(csv);
  } catch (err) {
    return errorResponse(res, 'Failed to export CSV', 500);
  }
}

async function exportPDF(req, res) {
  try {
    const result = await auditService.getLogs({ ...req.query, limit: 1000 });
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=audit_log_${moment().format('YYYY-MM-DD')}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).font('Helvetica-Bold').text('Legal Aid Platform — Audit Log Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Generated: ${moment().format('YYYY-MM-DD HH:mm:ss')}`, { align: 'center' });
    doc.moveDown();

    result.logs.forEach((log, idx) => {
      const color = log.severity === 'critical' ? 'red' : log.severity === 'warning' ? 'orange' : 'black';
      doc.fontSize(9).fillColor(color)
         .text(`[${log.severity.toUpperCase()}] ${log.event_type} | ${log.full_name || 'System'} | ${log.ip_address || 'N/A'} | ${moment(log.created_at).format('MM/DD/YY HH:mm')}`);
    });
    doc.end();
  } catch (err) {
    return errorResponse(res, 'Failed to export PDF', 500);
  }
}

module.exports = { getLogs, exportCSV, exportPDF };

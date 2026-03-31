const { exec }  = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const axios     = require('axios');
const db        = require('../../config/database');
const { auditService } = require('../audit/audit.service');
const { notifyAllAdmins } = require('../notifications/notification.service');
const logger    = require('../../utils/logger');
require('dotenv').config();

const TARGET_URL = process.env.FRONTEND_URL || 'http://localhost:5000';

// Simple built-in endpoint checker (no ZAP required for hackathon)
async function runBuiltInScan() {
  const endpoints = [
    { path: '/api/auth/login',    method: 'POST', expected: [400, 401, 422, 200] },
    { path: '/api/auth/register', method: 'POST', expected: [400, 201, 422] },
    { path: '/api/admin/logs',    method: 'GET',  expected: [401, 403] },
  ];

  const findings = [];
  const baseUrl  = `http://localhost:${process.env.PORT || 5000}`;

  for (const ep of endpoints) {
    try {
      const res = await axios({ method: ep.method, url: `${baseUrl}${ep.path}`,
        data: {}, validateStatus: () => true, timeout: 5000 });

      if (!ep.expected.includes(res.status)) {
        findings.push({
          endpoint: ep.path,
          method:   ep.method,
          issue:    `Unexpected status code: ${res.status}`,
          severity: 'medium',
          cvss:     5.0,
        });
      }
      // Check for missing security headers
      const requiredHeaders = ['x-content-type-options', 'x-frame-options', 'x-xss-protection'];
      for (const header of requiredHeaders) {
        if (!res.headers[header]) {
          findings.push({
            endpoint: ep.path,
            method:   ep.method,
            issue:    `Missing security header: ${header}`,
            severity: 'low',
            cvss:     3.1,
          });
        }
      }
    } catch (err) {
      findings.push({ endpoint: ep.path, method: ep.method,
        issue: `Endpoint unreachable: ${err.message}`, severity: 'info', cvss: 0 });
    }
  }
  return findings;
}

async function generateAIReport(findings) {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role:    'user',
          content: `You are a security analyst for a legal aid platform serving vulnerable users.
            Analyze these vulnerability scan findings and provide:
            1. Executive summary (2-3 sentences)
            2. CVSS severity breakdown
            3. Top 3 immediate remediation steps
            4. Compliance notes for legal platforms
            
            Findings: ${JSON.stringify(findings, null, 2)}
            
            Keep response concise and actionable.`,
        }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.content[0].text;
  } catch (err) {
    logger.error('[Scanner] AI report failed:', err.message);
    return `Manual review required. ${findings.length} findings detected. Check audit logs for details.`;
  }
}

async function runFullScan() {
  const startTime = Date.now();
  logger.info('[Scanner] Starting scheduled security scan');

  try {
    const findings = await runBuiltInScan();
    const aiSummary = await generateAIReport(findings);

    const counts = findings.reduce((acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    }, {});

    await db.query(
      `INSERT INTO security_reports
        (raw_findings, ai_summary, total_issues, critical_count, high_count,
         medium_count, low_count, scan_duration_ms)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [JSON.stringify(findings), aiSummary, findings.length,
       counts.critical || 0, counts.high || 0,
       counts.medium || 0, counts.low || 0,
       Date.now() - startTime]
    );

    if ((counts.critical || 0) > 0 || (counts.high || 0) > 0) {
      await notifyAllAdmins(
        '🔴 Security Scan: Critical Issues Found',
        `${counts.critical || 0} critical, ${counts.high || 0} high severity issues detected.`
      );
    }

    await auditService.log({ eventType: 'security_scan_completed', eventCategory: 'security',
      metadata: { totalIssues: findings.length, ...counts } });

    logger.info(`[Scanner] Scan complete: ${findings.length} findings`);
    return { findings, aiSummary, counts };
  } catch (err) {
    logger.error('[Scanner] Scan failed:', err);
    throw err;
  }
}

async function getLatestReports(limit = 10) {
  const { rows } = await db.query(
    `SELECT * FROM security_reports ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return rows;
}

module.exports = { runFullScan, getLatestReports };

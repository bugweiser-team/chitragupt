-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name             VARCHAR(255) NOT NULL,
  email                 VARCHAR(255) UNIQUE NOT NULL,
  phone_number          VARCHAR(20),
  password_hash         VARCHAR(255) NOT NULL,
  role                  VARCHAR(50) DEFAULT 'litigant' CHECK (role IN ('litigant', 'lawyer', 'admin')),
  is_email_verified     BOOLEAN DEFAULT FALSE,
  is_phone_verified     BOOLEAN DEFAULT FALSE,
  is_active             BOOLEAN DEFAULT TRUE,
  totp_secret           TEXT,
  totp_enabled          BOOLEAN DEFAULT FALSE,
  fcm_token             TEXT,
  web_push_subscription JSONB,
  last_login_at         TIMESTAMPTZ,
  last_login_ip         INET,
  login_count           INTEGER DEFAULT 0,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until          TIMESTAMPTZ,
  password_changed_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BACKUP CODES TABLE (for 2FA recovery)
-- ============================================================
CREATE TABLE backup_codes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash  VARCHAR(255) NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REFRESH TOKENS TABLE
-- ============================================================
CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  device_info JSONB,
  ip_address  INET,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked     BOOLEAN DEFAULT FALSE,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS TABLE (APPEND-ONLY — tamper-evident)
-- ============================================================
CREATE TABLE audit_logs (
  id           BIGSERIAL PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type   VARCHAR(100) NOT NULL,
  event_category VARCHAR(50) NOT NULL DEFAULT 'general',
  ip_address   INET,
  user_agent   TEXT,
  resource_type VARCHAR(100),
  resource_id  UUID,
  metadata     JSONB DEFAULT '{}',
  severity     VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  success      BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Make audit_logs truly append-only
REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM PUBLIC;

-- ============================================================
-- KNOWN DEVICES TABLE
-- ============================================================
CREATE TABLE known_devices (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_hash  VARCHAR(255) NOT NULL,
  device_name  VARCHAR(255),
  browser      VARCHAR(100),
  os           VARCHAR(100),
  ip_address   INET,
  is_trusted   BOOLEAN DEFAULT FALSE,
  first_seen   TIMESTAMPTZ DEFAULT NOW(),
  last_seen    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECURITY SCAN REPORTS TABLE
-- ============================================================
CREATE TABLE security_reports (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_type  VARCHAR(100) DEFAULT 'vulnerability_scan',
  raw_findings JSONB,
  ai_summary   TEXT,
  total_issues INTEGER DEFAULT 0,
  critical_count INTEGER DEFAULT 0,
  high_count   INTEGER DEFAULT 0,
  medium_count INTEGER DEFAULT 0,
  low_count    INTEGER DEFAULT 0,
  scan_duration_ms INTEGER,
  status       VARCHAR(50) DEFAULT 'completed',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PUSH NOTIFICATION LOG TABLE
-- ============================================================
CREATE TABLE notification_log (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  body         TEXT NOT NULL,
  type         VARCHAR(100) NOT NULL,
  channel      VARCHAR(50) DEFAULT 'fcm',
  delivered    BOOLEAN DEFAULT FALSE,
  error        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_audit_logs_user_id    ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity   ON audit_logs(severity);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_refresh_tokens_user   ON refresh_tokens(user_id);
CREATE INDEX idx_known_devices_user    ON known_devices(user_id);
CREATE INDEX idx_backup_codes_user     ON backup_codes(user_id);

-- Create CRM Schema for Bitrix24 Integration
-- This migration creates the complete database schema for managing real estate leads, 
-- activities, and opportunities with Bitrix24 CRM integration.

-- =====================================================
-- Table: leads
-- Stores all lead information captured from the website and synced with Bitrix24
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bitrix_lead_id text UNIQUE,
  apartment_id text,
  apartment_floor integer,
  apartment_size numeric,
  apartment_price numeric,
  apartment_bedrooms integer,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  preferred_contact_method text DEFAULT 'phone',
  message text,
  status text DEFAULT 'new',
  source text,
  assigned_to text,
  conversion_probability integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  bitrix_synced_at timestamptz
);

-- =====================================================
-- Table: lead_activities
-- Tracks all interactions and activities with leads
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  bitrix_activity_id text,
  activity_type text NOT NULL,
  subject text,
  description text,
  duration_minutes integer,
  scheduled_at timestamptz,
  completed_at timestamptz,
  outcome text,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- Table: opportunities
-- Manages qualified leads converted to sales opportunities
-- =====================================================
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  bitrix_deal_id text UNIQUE,
  title text NOT NULL,
  apartment_id text,
  deal_value numeric NOT NULL,
  probability integer DEFAULT 50,
  stage text NOT NULL DEFAULT 'qualification',
  expected_close_date date,
  actual_close_date date,
  close_reason text,
  assigned_to text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  bitrix_synced_at timestamptz
);

-- =====================================================
-- Table: sync_log
-- Audit trail for Bitrix24 API synchronization
-- =====================================================
CREATE TABLE IF NOT EXISTS sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  bitrix_id text,
  status text NOT NULL,
  request_payload jsonb,
  response_data jsonb,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- Indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_leads_bitrix_id ON leads(bitrix_lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_type ON lead_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_lead_id ON opportunities(lead_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_sync_log_entity ON sync_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON sync_log(status);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- Leads policies: Public can insert (form submissions), authenticated can view/update
CREATE POLICY "Public users can insert leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Lead activities policies: Only authenticated users
CREATE POLICY "Authenticated users can view activities"
  ON lead_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert activities"
  ON lead_activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update activities"
  ON lead_activities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Opportunities policies: Only authenticated users
CREATE POLICY "Authenticated users can view opportunities"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert opportunities"
  ON opportunities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update opportunities"
  ON opportunities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Sync log policies: Only authenticated users can view
CREATE POLICY "Authenticated users can view sync logs"
  ON sync_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert sync logs"
  ON sync_log FOR INSERT
  TO authenticated
  WITH CHECK (true);
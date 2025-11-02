/*
  # Add Analytics Events Table

  1. New Tables
    - `analytics_events`
      - `id` (uuid, primary key)
      - `event_type` (text) - Type of event (page_load, apartment_view, filter_applied, etc.)
      - `session_id` (text) - Browser session identifier
      - `visitor_id` (text) - Unique visitor identifier
      - `event_data` (jsonb) - Additional event data
      - `created_at` (timestamptz) - Event timestamp

  2. Security
    - Enable RLS on `analytics_events` table
    - Allow anonymous users to insert events (for tracking)
    - Allow authenticated users to view all events

  3. Indexes
    - Index on event_type for filtering
    - Index on session_id for session analysis
    - Index on created_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  event_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert analytics events
CREATE POLICY "Anonymous users can insert analytics events"
  ON analytics_events FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all analytics events
CREATE POLICY "Authenticated users can view analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (true);
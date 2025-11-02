/*
  # Fix RLS Policy for Anonymous Lead Inserts

  1. Changes
    - Drop and recreate the public insert policy for leads table
    - Ensure anon role can insert leads without restrictions
    - Add explicit policy for INSERT operations
    - Ensure all required columns can be inserted by anon role

  2. Security
    - Policy allows anonymous users to create leads (public form submissions)
    - Read operations still require authentication
    - Update operations still require authentication
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Public users can insert leads" ON leads;

-- Create a new, explicit policy for anonymous inserts
CREATE POLICY "Allow anonymous lead creation"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also ensure sync_log allows public inserts (for logging)
DROP POLICY IF EXISTS "Public can insert sync logs" ON sync_log;

CREATE POLICY "Allow public sync log inserts"
  ON sync_log
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

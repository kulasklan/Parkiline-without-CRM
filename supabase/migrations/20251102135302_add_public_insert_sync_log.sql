/*
  # Add Public Insert Policy for Sync Log

  1. Changes
    - Add policy to allow anonymous users to insert into sync_log table
    - This is needed for lead form submissions to log Bitrix sync status

  2. Security Note
    - Anonymous users can only INSERT, not read or modify existing records
    - This allows lead form to work without authentication
*/

-- Allow anonymous users to insert sync logs (for lead form submissions)
CREATE POLICY "Anonymous users can insert sync logs"
  ON sync_log FOR INSERT
  TO anon
  WITH CHECK (true);
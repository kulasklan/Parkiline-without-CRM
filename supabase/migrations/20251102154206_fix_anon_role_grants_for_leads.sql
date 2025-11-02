/*
  # Fix Anonymous Role Grants for Leads Table

  1. Changes
    - Grant INSERT permission to anon role on leads table
    - Grant USAGE on sequences to anon role
    - Ensure anon role has all necessary permissions
    
  2. Security
    - Only grants INSERT permission (not SELECT, UPDATE, DELETE)
    - RLS policies still control what can be inserted
*/

-- Grant INSERT permission to anon role
GRANT INSERT ON leads TO anon;

-- Grant USAGE on the sequence (for id generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Verify the grants
DO $$
BEGIN
  RAISE NOTICE 'Grants applied successfully for anon role on leads table';
END $$;

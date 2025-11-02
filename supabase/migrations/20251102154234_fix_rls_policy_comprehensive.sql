/*
  # Comprehensive RLS Policy Fix for Anonymous Lead Creation

  1. Changes
    - Drop existing policy and recreate with proper grants
    - Add policy for both anon and public roles
    - Grant necessary table permissions
    - Ensure policy syntax is correct for INSERT operations
    
  2. Security
    - Allows anonymous users to insert leads (public form submissions)
    - Does not allow anonymous users to read, update, or delete
*/

-- First, drop the existing policy
DROP POLICY IF EXISTS "Allow anonymous lead creation" ON leads;

-- Grant INSERT permission to anon and public roles
GRANT INSERT ON leads TO anon, public;

-- Grant USAGE on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, public;

-- Create policy that allows INSERT for anon and public roles
CREATE POLICY "Allow anonymous lead creation"
  ON leads
  FOR INSERT
  TO anon, public
  WITH CHECK (true);

-- Verify the policy was created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'leads'
    AND policyname = 'Allow anonymous lead creation'
    AND cmd = 'INSERT';
    
  IF policy_count = 1 THEN
    RAISE NOTICE 'Policy successfully created and verified';
  ELSE
    RAISE EXCEPTION 'Policy creation failed';
  END IF;
END $$;

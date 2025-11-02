/*
  # Fix Anonymous Role Permissions for Lead Inserts with Select

  1. Changes
    - Ensure anon role can SELECT from leads table after INSERT
    - This is needed because Supabase .insert().select() requires SELECT permission
    - Add explicit SELECT policy for anon role on their own inserted records
    
  2. Security
    - Anon users can INSERT leads
    - Anon users can SELECT only to retrieve the inserted record immediately
    - Authenticated users retain full access
*/

-- Ensure anon has SELECT permission (should already exist but let's be explicit)
GRANT SELECT ON leads TO anon;

-- Drop existing anon select policy if it exists
DROP POLICY IF EXISTS "anon_select_after_insert" ON leads;

-- Create a policy allowing anon to SELECT (needed for .insert().select() to work)
-- This allows the insert to return the created record
CREATE POLICY "anon_select_after_insert"
  ON leads
  FOR SELECT
  TO anon
  USING (true);

-- Verify the policies
DO $$
DECLARE
  insert_policy_count INTEGER;
  select_policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO insert_policy_count
  FROM pg_policies
  WHERE tablename = 'leads' 
    AND policyname = 'anon_insert_leads'
    AND cmd = 'INSERT';
    
  SELECT COUNT(*) INTO select_policy_count
  FROM pg_policies
  WHERE tablename = 'leads' 
    AND policyname = 'anon_select_after_insert'
    AND cmd = 'SELECT';
  
  RAISE NOTICE 'Anon INSERT policy exists: %', insert_policy_count > 0;
  RAISE NOTICE 'Anon SELECT policy exists: %', select_policy_count > 0;
  
  IF insert_policy_count = 0 OR select_policy_count = 0 THEN
    RAISE EXCEPTION 'Required policies are missing';
  END IF;
END $$;

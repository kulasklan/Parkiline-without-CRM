/*
  # Disable and Re-enable RLS with Correct Policy

  1. Changes
    - Temporarily disable RLS on leads table
    - Drop all existing policies
    - Re-enable RLS
    - Create fresh policies with correct permissions
    
  2. Security
    - Anonymous users can INSERT leads only
    - Authenticated users can SELECT, UPDATE leads
    - Proper role-based access control
*/

-- Step 1: Disable RLS temporarily
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous lead creation" ON leads;
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;

-- Step 3: Grant necessary permissions
GRANT INSERT ON leads TO anon;
GRANT SELECT, UPDATE ON leads TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Step 4: Re-enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Step 5: Create new policies with correct syntax
-- Policy for anonymous INSERT
CREATE POLICY "anon_insert_leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated SELECT
CREATE POLICY "authenticated_select_leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated UPDATE
CREATE POLICY "authenticated_update_leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verify policies were created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'leads';
    
  RAISE NOTICE 'Total policies created: %', policy_count;
  
  IF policy_count != 3 THEN
    RAISE EXCEPTION 'Expected 3 policies but found %', policy_count;
  END IF;
END $$;

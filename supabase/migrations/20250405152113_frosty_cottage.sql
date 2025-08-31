/*
  # Fix RLS policies for couples table

  1. Changes
    - Drop all existing policies
    - Create new policies with proper authentication checks
  
  2. Security
    - Enable RLS
    - Set up granular policies for each operation
    - Ensure proper authentication checks
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON couples;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON couples;
DROP POLICY IF EXISTS "couples_full_access" ON couples;
DROP POLICY IF EXISTS "couples_select" ON couples;
DROP POLICY IF EXISTS "couples_insert" ON couples;
DROP POLICY IF EXISTS "couples_update" ON couples;
DROP POLICY IF EXISTS "couples_delete" ON couples;

-- Ensure RLS is enabled
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper authentication checks
CREATE POLICY "couples_select_policy" ON couples
    FOR SELECT
    TO authenticated
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "couples_insert_policy" ON couples
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "couples_update_policy" ON couples
    FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "couples_delete_policy" ON couples
    FOR DELETE
    TO authenticated
    USING (auth.uid() IS NOT NULL);
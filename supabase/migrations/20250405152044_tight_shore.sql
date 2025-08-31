/*
  # Fix RLS policies for couples table

  1. Changes
    - Drop existing RLS policies for couples table
    - Create new policies with proper permissions for authenticated users
  
  2. Security
    - Enable full access for authenticated users
    - Ensure policies are properly configured for all operations
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON couples;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON couples;
DROP POLICY IF EXISTS "couples_full_access" ON couples;

-- Create new policies with proper permissions
CREATE POLICY "couples_select" ON couples
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "couples_insert" ON couples
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "couples_update" ON couples
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "couples_delete" ON couples
    FOR DELETE
    TO authenticated
    USING (true);
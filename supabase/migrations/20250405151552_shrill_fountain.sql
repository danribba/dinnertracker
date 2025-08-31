/*
  # Fix RLS policies for couples table

  1. Changes
    - Drop all existing policies for couples table
    - Create new, properly configured policies
  
  2. Security
    - Enable full access for authenticated users
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON couples;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON couples;

-- Create new policy with proper permissions
CREATE POLICY "couples_full_access" ON couples
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
/*
  # Fix RLS policies for couples table

  1. Changes
    - Drop existing RLS policy for couples table
    - Create new RLS policy that allows authenticated users to perform all operations
  
  2. Security
    - Enable full access for authenticated users
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON couples;

-- Create new policy with proper permissions
CREATE POLICY "Enable full access for authenticated users" ON couples
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
/*
  # Add user_id to couples table

  1. Changes
    - Add user_id column to couples table
    - Make user_id NOT NULL
    - Add foreign key constraint to auth.users
    - Update RLS policies to use user_id
  
  2. Security
    - Ensure users can only access their own couples
*/

-- Add user_id column
ALTER TABLE couples ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();

-- Add foreign key constraint
ALTER TABLE couples ADD CONSTRAINT couples_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "couples_select_policy" ON couples;
DROP POLICY IF EXISTS "couples_insert_policy" ON couples;
DROP POLICY IF EXISTS "couples_update_policy" ON couples;
DROP POLICY IF EXISTS "couples_delete_policy" ON couples;

-- Create new policies that check user_id
CREATE POLICY "couples_select_policy" ON couples
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "couples_insert_policy" ON couples
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "couples_update_policy" ON couples
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "couples_delete_policy" ON couples
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
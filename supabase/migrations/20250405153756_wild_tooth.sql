/*
  # Add user_id to dinner_dates table

  1. Changes
    - Add user_id column to dinner_dates table
    - Make user_id NOT NULL
    - Add foreign key constraint to auth.users
    - Update RLS policies to use user_id
  
  2. Security
    - Ensure users can only access their own dinner dates
    - Maintain existing relationship checks with couples table
*/

-- Add user_id column
ALTER TABLE dinner_dates ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();

-- Add foreign key constraint
ALTER TABLE dinner_dates ADD CONSTRAINT dinner_dates_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "dinner_dates_select_policy" ON dinner_dates;
DROP POLICY IF EXISTS "dinner_dates_insert_policy" ON dinner_dates;
DROP POLICY IF EXISTS "dinner_dates_update_policy" ON dinner_dates;
DROP POLICY IF EXISTS "dinner_dates_delete_policy" ON dinner_dates;

-- Create new policies that check both user_id and couple ownership
CREATE POLICY "dinner_dates_select_policy" ON dinner_dates
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = dinner_dates.couple_id
            AND couples.user_id = auth.uid()
        )
    );

CREATE POLICY "dinner_dates_insert_policy" ON dinner_dates
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = dinner_dates.couple_id
            AND couples.user_id = auth.uid()
        )
    );

CREATE POLICY "dinner_dates_update_policy" ON dinner_dates
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = dinner_dates.couple_id
            AND couples.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = dinner_dates.couple_id
            AND couples.user_id = auth.uid()
        )
    );

CREATE POLICY "dinner_dates_delete_policy" ON dinner_dates
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = dinner_dates.couple_id
            AND couples.user_id = auth.uid()
        )
    );
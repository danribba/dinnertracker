/*
  # Add RLS policies for dinner_dates table

  1. Changes
    - Enable RLS on dinner_dates table
    - Add policies to ensure users can only access dinner dates for their couples
  
  2. Security
    - Users can only access dinner dates for couples they own
    - Policies check user_id through the couples table relationship
*/

-- Enable RLS
ALTER TABLE dinner_dates ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON dinner_dates;

-- Create new policies that check user_id through the couples relationship
CREATE POLICY "dinner_dates_select_policy" ON dinner_dates
    FOR SELECT
    TO authenticated
    USING (
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
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = dinner_dates.couple_id
            AND couples.user_id = auth.uid()
        )
    )
    WITH CHECK (
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
        EXISTS (
            SELECT 1 FROM couples
            WHERE couples.id = dinner_dates.couple_id
            AND couples.user_id = auth.uid()
        )
    );
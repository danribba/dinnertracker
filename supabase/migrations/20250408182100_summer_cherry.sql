/*
  # Fix dinner dates schema

  1. Changes
    - Ensure dinner_date_couples table exists with proper constraints
    - Fix location values in dinner_dates table
    - Add proper indexes for performance
  
  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing dinner_date_couples table if it exists
DROP TABLE IF EXISTS dinner_date_couples;

-- Create dinner_date_couples table with proper constraints
CREATE TABLE dinner_date_couples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dinner_date_id uuid NOT NULL REFERENCES dinner_dates(id) ON DELETE CASCADE,
    couple_id uuid NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(dinner_date_id, couple_id)
);

-- Create indexes for better performance
CREATE INDEX idx_dinner_date_couples_dinner_date_id ON dinner_date_couples(dinner_date_id);
CREATE INDEX idx_dinner_date_couples_couple_id ON dinner_date_couples(couple_id);
CREATE INDEX idx_dinner_date_couples_user_id ON dinner_date_couples(user_id);

-- Enable RLS
ALTER TABLE dinner_date_couples ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "dinner_date_couples_select_policy" ON dinner_date_couples
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "dinner_date_couples_insert_policy" ON dinner_date_couples
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dinner_date_couples_update_policy" ON dinner_date_couples
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dinner_date_couples_delete_policy" ON dinner_date_couples
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Fix location values in dinner_dates table
ALTER TABLE dinner_dates DROP CONSTRAINT IF EXISTS dinner_dates_location_check;
ALTER TABLE dinner_dates ADD CONSTRAINT dinner_dates_location_check 
  CHECK (location IN ('home', 'away'));

-- Update any existing locations to lowercase
UPDATE dinner_dates SET location = LOWER(location);
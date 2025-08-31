/*
  # Add support for multiple couples per dinner date

  1. New Tables
    - `dinner_date_couples`
      - `id` (uuid, primary key)
      - `dinner_date_id` (uuid, foreign key)
      - `couple_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Changes
    - Remove direct couple_id from dinner_dates table
    - Add junction table for many-to-many relationship

  3. Security
    - Enable RLS on new table
    - Add appropriate policies
*/

-- Create junction table
CREATE TABLE IF NOT EXISTS dinner_date_couples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dinner_date_id uuid REFERENCES dinner_dates(id) ON DELETE CASCADE,
    couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(dinner_date_id, couple_id)
);

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

CREATE POLICY "dinner_date_couples_delete_policy" ON dinner_date_couples
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Migrate existing data
INSERT INTO dinner_date_couples (dinner_date_id, couple_id, user_id)
SELECT id, couple_id, user_id
FROM dinner_dates
WHERE couple_id IS NOT NULL;

-- Remove couple_id from dinner_dates
ALTER TABLE dinner_dates DROP COLUMN couple_id;
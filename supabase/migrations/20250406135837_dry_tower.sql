/*
  # Create dinner date couples junction table

  1. New Tables
    - `dinner_date_couples`
      - `id` (uuid, primary key)
      - `dinner_date_id` (uuid, foreign key to dinner_dates)
      - `couple_id` (uuid, foreign key to couples)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Create indexes for better performance
*/

-- Create dinner_date_couples table with proper constraints and indexes
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
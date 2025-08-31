/*
  # Fix dinner dates relationships

  1. Changes
    - Add missing foreign key constraints
    - Update RLS policies to ensure proper access
  
  2. Security
    - Maintain existing RLS policies
    - Ensure proper user access control
*/

-- Drop existing dinner_date_couples table if it exists
DROP TABLE IF EXISTS dinner_date_couples;

-- Recreate dinner_date_couples table with proper constraints
CREATE TABLE dinner_date_couples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dinner_date_id uuid NOT NULL,
    couple_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT dinner_date_couples_dinner_date_id_fkey
        FOREIGN KEY (dinner_date_id) 
        REFERENCES dinner_dates(id) 
        ON DELETE CASCADE,
    CONSTRAINT dinner_date_couples_couple_id_fkey
        FOREIGN KEY (couple_id) 
        REFERENCES couples(id) 
        ON DELETE CASCADE,
    CONSTRAINT dinner_date_couples_user_id_fkey
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE,
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
/*
  # Dinner Dates Schema

  1. New Tables
    - `couples`
      - `id` (uuid, primary key)
      - `names` (text) - Names of the couple
      - `created_at` (timestamp)
    
    - `dinner_dates`
      - `id` (uuid, primary key)
      - `couple_id` (uuid, foreign key)
      - `date` (date)
      - `menu` (text)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
*/

-- Create couples table
CREATE TABLE IF NOT EXISTS couples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    names text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create dinner_dates table
CREATE TABLE IF NOT EXISTS dinner_dates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
    date date NOT NULL,
    menu text,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE dinner_dates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all access for authenticated users" ON couples
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (false);

CREATE POLICY "Enable all access for authenticated users" ON dinner_dates
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
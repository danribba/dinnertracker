/*
  # Update couples table schema

  1. Changes
    - Add 'names' column to couples table if it doesn't exist
  
  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'couples' 
    AND column_name = 'names'
  ) THEN 
    ALTER TABLE couples ADD COLUMN names text NOT NULL;
  END IF;
END $$;
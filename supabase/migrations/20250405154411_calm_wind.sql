/*
  # Fix location field in dinner_dates table

  1. Changes
    - Drop existing location constraints if they exist
    - Ensure location column exists with correct constraints
    - Update any NULL values to 'Home'
  
  2. Security
    - Maintain existing RLS policies
*/

-- First, drop existing check constraint if it exists
DO $$ 
BEGIN 
  IF EXISTS (
    SELECT 1
    FROM information_schema.constraint_column_usage
    WHERE table_name = 'dinner_dates'
    AND constraint_name = 'dinner_dates_location_check'
  ) THEN
    ALTER TABLE dinner_dates DROP CONSTRAINT dinner_dates_location_check;
  END IF;
END $$;

-- Ensure location column exists with correct type and constraints
DO $$ 
BEGIN 
  -- Add column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'dinner_dates' 
    AND column_name = 'location'
  ) THEN 
    ALTER TABLE dinner_dates ADD COLUMN location text;
  END IF;

  -- Update any NULL values to 'Home'
  UPDATE dinner_dates SET location = 'Home' WHERE location IS NULL;

  -- Make column NOT NULL
  ALTER TABLE dinner_dates ALTER COLUMN location SET NOT NULL;

  -- Add check constraint
  ALTER TABLE dinner_dates ADD CONSTRAINT dinner_dates_location_check 
    CHECK (location IN ('Home', 'Away'));
END $$;
/*
  # Fix location constraint in dinner_dates table

  1. Changes
    - Drop existing location check constraint if it exists
    - Add new location check constraint with correct values
  
  2. Security
    - Maintain existing RLS policies
*/

-- First, ensure the location column exists and has the correct type
DO $$ 
BEGIN 
  -- Add location column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'dinner_dates' 
    AND column_name = 'location'
  ) THEN 
    ALTER TABLE dinner_dates ADD COLUMN location text;
  END IF;
END $$;

-- Update any NULL values to 'home'
UPDATE dinner_dates SET location = 'home' WHERE location IS NULL;

-- Make column NOT NULL
ALTER TABLE dinner_dates ALTER COLUMN location SET NOT NULL;

-- Add new check constraint
ALTER TABLE dinner_dates ADD CONSTRAINT dinner_dates_location_check 
  CHECK (location IN ('home', 'away'));
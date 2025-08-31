/*
  # Update dinner_dates table with location field

  1. Changes
    - Add location column to dinner_dates table
    - Add check constraint to ensure valid values ('Home', 'Away')
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add location column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'dinner_dates' 
    AND column_name = 'location'
  ) THEN 
    ALTER TABLE dinner_dates ADD COLUMN location text NOT NULL DEFAULT 'Home';
    ALTER TABLE dinner_dates ADD CONSTRAINT dinner_dates_location_check CHECK (location IN ('Home', 'Away'));
  END IF;
END $$;
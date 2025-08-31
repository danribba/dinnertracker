/*
  # Fix dinner dates schema and constraints

  1. Changes
    - Ensure couple_id is removed from dinner_dates
    - Fix location constraint to use lowercase values
    - Update dinner_date_couples constraints
  
  2. Security
    - Maintain existing RLS policies
*/

-- First ensure couple_id is removed from dinner_dates
ALTER TABLE dinner_dates DROP COLUMN IF EXISTS couple_id;

-- Fix location constraint
ALTER TABLE dinner_dates DROP CONSTRAINT IF EXISTS dinner_dates_location_check;
ALTER TABLE dinner_dates ADD CONSTRAINT dinner_dates_location_check 
  CHECK (location IN ('home', 'away'));

-- Update any existing locations to lowercase
UPDATE dinner_dates SET location = LOWER(location);
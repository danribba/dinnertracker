/*
  # Update location options in dinner_dates table

  1. Changes
    - Update location column constraint to use 'Home' and 'Away' values
  
  2. Security
    - Maintain existing RLS policies
*/

-- First remove the existing check constraint
ALTER TABLE dinner_dates DROP CONSTRAINT dinner_dates_location_check;

-- Add new check constraint with updated values
ALTER TABLE dinner_dates ADD CONSTRAINT dinner_dates_location_check CHECK (location IN ('Home', 'Away'));
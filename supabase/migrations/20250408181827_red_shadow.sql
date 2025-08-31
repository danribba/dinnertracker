/*
  # Remove couple_id from dinner_dates table

  1. Changes
    - Remove couple_id column from dinner_dates table since we're using dinner_date_couples junction table
  
  2. Security
    - Maintain existing RLS policies
*/

-- Remove couple_id column from dinner_dates
ALTER TABLE dinner_dates DROP COLUMN IF EXISTS couple_id;
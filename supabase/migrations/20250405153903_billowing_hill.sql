/*
  # Add location field to dinner_dates table

  1. Changes
    - Add location column to dinner_dates table
    - Add check constraint to ensure valid location values
  
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE dinner_dates ADD COLUMN location text NOT NULL CHECK (location IN ('our_place', 'their_place'));
/*
  # Fix column name in couples table

  1. Changes
    - Rename 'names' column to 'name' in couples table
  
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE couples RENAME COLUMN names TO name;
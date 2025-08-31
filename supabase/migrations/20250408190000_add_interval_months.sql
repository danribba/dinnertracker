-- Add interval_months column to couples table
ALTER TABLE couples ADD COLUMN interval_months integer NOT NULL DEFAULT 6;

-- Add comment to explain the column
COMMENT ON COLUMN couples.interval_months IS 'Number of months between preferred dinner dates'; 
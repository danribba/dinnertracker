/*
  # Fix dinner_date_couples table

  1. Changes
    - Drop existing table if it exists
    - Recreate table with proper constraints
    - Add indexes for better performance
    - Set up RLS policies
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- First, drop the table if it exists
DROP TABLE IF EXISTS public.dinner_date_couples;

-- Create dinner_date_couples table with proper constraints and indexes
CREATE TABLE public.dinner_date_couples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dinner_date_id uuid NOT NULL REFERENCES public.dinner_dates(id) ON DELETE CASCADE,
    couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(dinner_date_id, couple_id)
);

-- Create indexes for better performance
CREATE INDEX idx_dinner_date_couples_dinner_date_id ON public.dinner_date_couples(dinner_date_id);
CREATE INDEX idx_dinner_date_couples_couple_id ON public.dinner_date_couples(couple_id);
CREATE INDEX idx_dinner_date_couples_user_id ON public.dinner_date_couples(user_id);

-- Enable RLS
ALTER TABLE public.dinner_date_couples ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "dinner_date_couples_select_policy" ON public.dinner_date_couples
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "dinner_date_couples_insert_policy" ON public.dinner_date_couples
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dinner_date_couples_update_policy" ON public.dinner_date_couples
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dinner_date_couples_delete_policy" ON public.dinner_date_couples
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
/*
  # Create new table

  1. New Tables
    - `new_table`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own data
*/

-- Create the table
CREATE TABLE public.new_table (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_new_table_user_id ON public.new_table(user_id);

-- Enable RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "new_table_select_policy" ON public.new_table
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "new_table_insert_policy" ON public.new_table
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "new_table_update_policy" ON public.new_table
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "new_table_delete_policy" ON public.new_table
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
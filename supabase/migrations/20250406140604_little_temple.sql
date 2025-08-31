/*
  # Create example table

  1. New Tables
    - `examples`
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
CREATE TABLE public.examples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_examples_user_id ON public.examples(user_id);

-- Enable RLS
ALTER TABLE public.examples ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "examples_select_policy" ON public.examples
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "examples_insert_policy" ON public.examples
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "examples_update_policy" ON public.examples
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "examples_delete_policy" ON public.examples
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
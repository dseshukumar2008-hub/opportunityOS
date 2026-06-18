-- Drop the broken table
DROP TABLE IF EXISTS public.match_resumes;

-- Create the match_resumes table using 'text' for user_id to support Firebase UIDs
CREATE TABLE public.match_resumes (
  user_id text not null primary key,
  resume_file_name text,
  resume_text text,
  extracted_skills jsonb default '[]'::jsonb,
  upload_date timestamp with time zone default timezone('utc'::text, now()) not null,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.match_resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Since the app uses Firebase Auth, Supabase's auth.uid() is null for anonymous clients.
-- We must allow public operations for the match_resumes table for the frontend to work.
CREATE POLICY "Allow public select" 
  ON public.match_resumes FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert" 
  ON public.match_resumes FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update" 
  ON public.match_resumes FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete" 
  ON public.match_resumes FOR DELETE 
  USING (true);

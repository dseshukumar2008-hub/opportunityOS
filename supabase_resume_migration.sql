-- Create resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null default 'My Resume',
  template text not null default 'Modern',
  personal_info jsonb default '{}'::jsonb,
  education jsonb[] default '{}',
  experience jsonb[] default '{}',
  projects jsonb[] default '{}',
  skills jsonb[] default '{}',
  certifications jsonb[] default '{}',
  languages jsonb[] default '{}',
  achievements jsonb[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own resumes." 
  ON public.resumes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes." 
  ON public.resumes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes." 
  ON public.resumes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes." 
  ON public.resumes FOR DELETE 
  USING (auth.uid() = user_id);


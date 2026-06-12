-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  opportunity_id uuid, -- Nullable if added manually
  opportunity_title text not null,
  company_name text not null,
  type text default 'Internship',
  status text not null default 'Applied',
  applied_date text,
  deadline text,
  notes text,
  interview_date text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own applications." 
  ON public.applications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications." 
  ON public.applications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications." 
  ON public.applications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications." 
  ON public.applications FOR DELETE 
  USING (auth.uid() = user_id);

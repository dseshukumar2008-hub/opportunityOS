-- 1. Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users not null,
  company_name text not null,
  website text,
  description text,
  industry text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies on delete cascade not null,
  title text not null,
  description text,
  skills_required text[] default '{}',
  location text,
  type text default 'Internship',
  salary text,
  status text default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create candidate_shortlists table
CREATE TABLE IF NOT EXISTS public.candidate_shortlists (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies on delete cascade not null,
  application_id uuid references public.applications on delete cascade not null,
  status text default 'Shortlisted',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(company_id, application_id)
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_shortlists ENABLE ROW LEVEL SECURITY;

-- Add user_type to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type text default 'student';

-- COMPANIES POLICIES
CREATE POLICY "Companies are viewable by everyone." 
  ON public.companies FOR SELECT USING (true);

CREATE POLICY "Users can insert their own company." 
  ON public.companies FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their company." 
  ON public.companies FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their company." 
  ON public.companies FOR DELETE USING (auth.uid() = owner_id);

-- OPPORTUNITIES POLICIES
CREATE POLICY "Opportunities are viewable by everyone." 
  ON public.opportunities FOR SELECT USING (true);

CREATE POLICY "Company owners can insert opportunities." 
  ON public.opportunities FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = opportunities.company_id AND owner_id = auth.uid()));

CREATE POLICY "Company owners can update their opportunities." 
  ON public.opportunities FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = opportunities.company_id AND owner_id = auth.uid()));

CREATE POLICY "Company owners can delete their opportunities." 
  ON public.opportunities FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = opportunities.company_id AND owner_id = auth.uid()));

-- CANDIDATE SHORTLISTS POLICIES
CREATE POLICY "Company owners can view their shortlists." 
  ON public.candidate_shortlists FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = candidate_shortlists.company_id AND owner_id = auth.uid()));

CREATE POLICY "Company owners can insert shortlists." 
  ON public.candidate_shortlists FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = candidate_shortlists.company_id AND owner_id = auth.uid()));

CREATE POLICY "Company owners can update shortlists." 
  ON public.candidate_shortlists FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = candidate_shortlists.company_id AND owner_id = auth.uid()));

CREATE POLICY "Company owners can delete shortlists." 
  ON public.candidate_shortlists FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = candidate_shortlists.company_id AND owner_id = auth.uid()));

-- We also need to let employers view applications submitted to their opportunities
CREATE POLICY "Company owners can view applications to their opportunities." 
  ON public.applications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      JOIN public.companies c ON o.company_id = c.id 
      WHERE o.id = applications.opportunity_id AND c.owner_id = auth.uid()
    )
  );

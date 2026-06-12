CREATE TABLE IF NOT EXISTS public.employer_reviews (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies on delete cascade not null,
  application_id uuid references public.applications on delete cascade not null,
  
  -- AI Evaluation Cache
  gemini_score integer,
  gemini_strengths text[],
  gemini_concerns text[],
  gemini_missing_skills text[],
  gemini_recommendation text,
  gemini_interview_priority text,
  gemini_summary text,
  
  -- Employer Manual Actions
  status text default 'Pending', -- Pending, Shortlisted, Rejected
  notes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(company_id, application_id)
);

ALTER TABLE public.employer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company owners can view their reviews." 
  ON public.employer_reviews FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = employer_reviews.company_id AND owner_id = auth.uid()));

CREATE POLICY "Company owners can insert reviews." 
  ON public.employer_reviews FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = employer_reviews.company_id AND owner_id = auth.uid()));

CREATE POLICY "Company owners can update reviews." 
  ON public.employer_reviews FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = employer_reviews.company_id AND owner_id = auth.uid()));

CREATE POLICY "Company owners can delete reviews." 
  ON public.employer_reviews FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.companies WHERE id = employer_reviews.company_id AND owner_id = auth.uid()));

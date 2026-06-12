-- 1. Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users not null,
  name text not null,
  description text,
  category text,
  max_members integer default 5,
  status text default 'recruiting',
  required_skills text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams on delete cascade not null,
  user_id uuid references auth.users not null,
  role text default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(team_id, user_id)
);

-- 3. Create messages (Direct Messages) table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users not null,
  receiver_id uuid references auth.users not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create team_requests table
CREATE TABLE IF NOT EXISTS public.team_requests (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams on delete cascade not null,
  user_id uuid references auth.users not null,
  status text default 'pending',
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(team_id, user_id)
);

-- 5. Create team_messages table
CREATE TABLE IF NOT EXISTS public.team_messages (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams on delete cascade not null,
  sender_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

-- TEAMS POLICIES
CREATE POLICY "Teams are viewable by everyone." 
  ON public.teams FOR SELECT USING (true);

CREATE POLICY "Users can insert teams." 
  ON public.teams FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their teams." 
  ON public.teams FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their teams." 
  ON public.teams FOR DELETE USING (auth.uid() = owner_id);

-- TEAM MEMBERS POLICIES
CREATE POLICY "Team members are viewable by everyone." 
  ON public.team_members FOR SELECT USING (true);

CREATE POLICY "Users can manage their own memberships." 
  ON public.team_members FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Team owners can manage memberships." 
  ON public.team_members FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.teams WHERE id = team_members.team_id AND owner_id = auth.uid()
    )
  );

-- MESSAGES POLICIES
CREATE POLICY "Users can view messages they sent or received." 
  ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages they sent." 
  ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received (e.g. read status)." 
  ON public.messages FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- TEAM REQUESTS POLICIES
CREATE POLICY "Team requests viewable by the user or the team owner." 
  ON public.team_requests FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_requests.team_id AND owner_id = auth.uid())
  );

CREATE POLICY "Users can insert team requests." 
  ON public.team_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Team owners can update/delete team requests." 
  ON public.team_requests FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.teams WHERE id = team_requests.team_id AND owner_id = auth.uid())
  );

-- TEAM MESSAGES POLICIES
CREATE POLICY "Team messages viewable by team members." 
  ON public.team_messages FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = team_messages.team_id AND user_id = auth.uid())
  );

CREATE POLICY "Team members can insert team messages." 
  ON public.team_messages FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = team_messages.team_id AND user_id = auth.uid()) AND
    auth.uid() = sender_id
  );

-- AgentPulse database schema
-- Run in Supabase SQL Editor

create table agents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  gateway_url text not null,
  api_key text,
  test_prompt text not null,
  expected_answer text not null,
  check_interval integer default 60,
  threshold integer default 70,
  created_at timestamptz default now()
);

create table checks (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references agents(id) on delete cascade not null,
  score integer not null,
  response text,
  judge_response text,
  created_at timestamptz default now()
);

create table alerts (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references agents(id) on delete cascade not null,
  score integer not null,
  triggered_at timestamptz default now(),
  resolved_at timestamptz
);

alter table agents enable row level security;
alter table checks enable row level security;
alter table alerts enable row level security;

create policy "Users can CRUD their own agents" on agents for all using (auth.uid() = user_id);
create policy "Users can read their own checks" on checks for select using (agent_id in (select id from agents where user_id = auth.uid()));
create policy "Service can insert checks" on checks for insert with check (true);
create policy "Users can read their own alerts" on alerts for select using (agent_id in (select id from agents where user_id = auth.uid()));

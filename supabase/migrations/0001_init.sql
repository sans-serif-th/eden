-- EDEN initial schema: onboarding answers, enrollments (a user's study plan
-- for one Level+Book), and day_records (per-day logged progress).
-- Mirrors the shapes in src/AppState.tsx.

create table if not exists onboarding_answers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  onboarding_complete boolean not null default false,
  preferred_time text not null default '05:00',
  preferred_place text not null default 'บ้าน',
  preferred_duration_minutes int not null default 15,
  updated_at timestamptz not null default now()
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  level text not null,
  book int not null default 1,
  start_preference text not null check (start_preference in ('today', 'next-week', 'custom')),
  custom_start_date date,
  started_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Only one active Enrollment per user — switching Level/Book or advancing
-- to the next Book flips the old row's is_active to false and inserts a
-- new one, rather than mutating in place, so history is preserved.
create unique index if not exists one_active_enrollment_per_user
  on enrollments (user_id)
  where is_active;

create table if not exists day_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  enrollment_id uuid not null references enrollments (id) on delete cascade,
  day_number int not null,
  answers jsonb not null default '{}'::jsonb,
  current_step int not null default 0,
  status text check (status in ('done')),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, day_number)
);

create index if not exists day_records_enrollment_idx on day_records (enrollment_id);

alter table onboarding_answers enable row level security;
alter table enrollments enable row level security;
alter table day_records enable row level security;

create policy "onboarding_answers: owner read" on onboarding_answers
  for select using (auth.uid() = user_id);
create policy "onboarding_answers: owner insert" on onboarding_answers
  for insert with check (auth.uid() = user_id);
create policy "onboarding_answers: owner update" on onboarding_answers
  for update using (auth.uid() = user_id);

create policy "enrollments: owner read" on enrollments
  for select using (auth.uid() = user_id);
create policy "enrollments: owner insert" on enrollments
  for insert with check (auth.uid() = user_id);
create policy "enrollments: owner update" on enrollments
  for update using (auth.uid() = user_id);

create policy "day_records: owner read" on day_records
  for select using (auth.uid() = user_id);
create policy "day_records: owner insert" on day_records
  for insert with check (auth.uid() = user_id);
create policy "day_records: owner update" on day_records
  for update using (auth.uid() = user_id);

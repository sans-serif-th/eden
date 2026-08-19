-- 0001_init.sql enabled RLS and added owner-scoped policies, but never
-- granted the underlying table privileges those policies filter — Postgres
-- denies access at the GRANT level before RLS is even evaluated, so every
-- request from the `authenticated` role (including our anonymous-auth users,
-- who sign in as `authenticated`) was failing with 42501 regardless of RLS.

grant select, insert, update on public.onboarding_answers to authenticated;
grant select, insert, update on public.enrollments to authenticated;
grant select, insert, update on public.day_records to authenticated;

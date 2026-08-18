# Vercel serverless + Supabase for the backend

**Status:** accepted

No backend exists yet — the app is currently 100% client-side state. We chose Vercel serverless/Edge functions (same deploy target as the already-live frontend) backed by Supabase (managed Postgres), over standing up a dedicated server or pairing a different managed Postgres with a hand-built API layer. The workload is plain CRUD (Enrollments, progress, journal answers) plus daily-unlock-timestamp logic — no long-running jobs — so a separate server buys nothing but operational overhead. Supabase's built-in table editor is also a deliberate stopgap for content loading/editing while the CMS stays out of MVP scope, rather than building custom admin UI just to unblock content entry.

## Consequences

- Content authoring/editing happens directly in Supabase's table editor until (if ever) a real CMS is built.
- LIFF ID-token verification happens in Vercel serverless functions, not a separate auth service.

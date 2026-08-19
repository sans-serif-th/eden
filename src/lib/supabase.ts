import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — copy .env.example to .env and fill them in.",
  );
}

export const supabase = createClient(url, anonKey);

// Anonymous auth stands in for real LINE identity until the LIFF channel
// exists (see CONTEXT.md) — same row-level-security model works either way,
// this just swaps which sign-in method populates auth.uid().
export async function ensureSignedIn() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user.id;

  const { data: signInData, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return signInData.user!.id;
}

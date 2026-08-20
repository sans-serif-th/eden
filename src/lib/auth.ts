import { supabase } from "./supabase";
import { ensureLiffInit, getLiffIdToken, isLiffLoggedIn } from "./liff";

// A Supabase session persists in localStorage, but the LINE in-app browser's
// storage is known to be dropped across full close/reopen cycles — so on a
// fresh load we can't assume a prior session survived and must be ready to
// re-derive one from LINE's own identity instead of falling back to a brand
// new anonymous user (which was the original bug: every reopen looked like a
// stranger and re-triggered onboarding).
//
// Returns the Supabase user id once identity is established, or null if
// there's currently no way to establish it (outside the LINE client, before
// the user has tapped the LINE login button) — callers should route to
// LoginPage in that case.
export async function bootstrapAuth(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  // An anonymous session left over from before this app used real LINE
  // identity (or from local dev outside the LINE client) is never the right
  // session to keep reusing — always re-derive the LINE-linked identity
  // instead of trusting it.
  if (data.session && !data.session.user.is_anonymous) {
    return data.session.user.id;
  }

  await ensureLiffInit();
  if (!(await isLiffLoggedIn())) return null;

  const idToken = getLiffIdToken();
  if (!idToken) return null;

  const { data: signInData, error } = await supabase.auth.signInWithIdToken({
    provider: "custom:line-login",
    token: idToken,
  });
  if (error) throw error;
  return signInData.user?.id ?? null;
}

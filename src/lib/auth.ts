import { supabase } from "./supabase";
import { ensureLiffInit, getLiffIdToken, isLiffLoggedIn } from "./liff";

const AUTH_TIMEOUT_MS = 8000;

// liff.init() and the Supabase token exchange are both network calls with no
// built-in timeout — if either hangs (flaky connection, a slow/misbehaving
// endpoint), bootstrapAuth must still resolve so the app can fall back to
// LoginPage instead of leaving the user stuck on a blank loading screen
// forever.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Timed out after ${ms}ms`)),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

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
  const { data, error: sessionError } = await supabase.auth.getSession();
  // An anonymous session left over from before this app used real LINE
  // identity (or from local dev outside the LINE client) is never the right
  // session to keep reusing — always re-derive the LINE-linked identity
  // instead of trusting it.
  if (data.session && !data.session.user.is_anonymous) {
    return data.session.user.id;
  }
  if (sessionError) {
    // getSession() tried to silently refresh an expired access token and
    // the server rejected the stored refresh token (already rotated/
    // revoked — seen live after repeated testing). supabase-js doesn't
    // always clear its own storage when that happens, so a poisoned
    // session can keep getting retried and rejected on every load. Force
    // a clean local slate before falling through to a fresh LINE sign-in.
    await supabase.auth.signOut();
  }

  await withTimeout(ensureLiffInit(), AUTH_TIMEOUT_MS);
  if (!(await isLiffLoggedIn())) return null;

  const idToken = getLiffIdToken();
  if (!idToken) return null;

  const { data: signInData, error } = await withTimeout(
    supabase.auth.signInWithIdToken({
      provider: "custom:line-login",
      token: idToken,
    }),
    AUTH_TIMEOUT_MS,
  );
  if (error) throw error;
  return signInData.user?.id ?? null;
}

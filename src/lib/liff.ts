import liff from "@line/liff";

const liffId = import.meta.env.VITE_LIFF_ID;

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

let initPromise: Promise<void> | null = null;

// liff.init() is safe to call more than once, but we still only want one
// in-flight init across the whole app, so every caller awaits the same
// promise instead of racing separate init() calls.
export function ensureLiffInit(): Promise<void> {
  if (!liffId) {
    return Promise.reject(
      new Error("Missing VITE_LIFF_ID — copy .env.example to .env and fill it in."),
    );
  }
  if (!initPromise) initPromise = liff.init({ liffId });
  return initPromise;
}

// True when running inside the LINE client (auto-authenticated on init) or
// once the user has completed loginWithLine()'s redirect round-trip.
export async function isLiffLoggedIn(): Promise<boolean> {
  await ensureLiffInit();
  return liff.isLoggedIn();
}

// The raw OIDC ID token LINE issued for the current session — this is what
// gets exchanged for a Supabase session via signInWithIdToken. Only
// meaningful once isLiffLoggedIn() is true.
export function getLiffIdToken(): string | null {
  return liff.getIDToken();
}

// Resolves the current LINE profile if a session already exists — either
// because the app is running inside the LINE client (which auto-authenticates
// on init) or because the user already completed loginWithLine()'s redirect
// round-trip. Resolves null rather than prompting a login.
export async function getLineProfile(): Promise<LineProfile | null> {
  await ensureLiffInit();
  if (!liff.isLoggedIn()) return null;
  return liff.getProfile();
}

// Outside the LINE client this redirects the whole page to LINE's login
// screen and back — nothing after this call runs until that round-trip
// completes on the next page load, so don't await it expecting a return value.
//
// Always force a fresh login rather than trusting the cached isLoggedIn()
// flag: LINE can revoke the underlying access token server-side (seen after
// repeated rapid re-auth attempts) while LIFF's local state still reports
// logged-in, which would silently no-op this button and strand the user on
// LoginPage with no way to recover short of clearing app storage by hand.
// This function only ever runs from an explicit button tap, so a full
// logout+login cycle here is never wasted work.
export async function loginWithLine() {
  await ensureLiffInit();
  if (liff.isLoggedIn()) liff.logout();
  liff.login();
}

export async function logoutFromLine() {
  await ensureLiffInit();
  if (liff.isLoggedIn()) liff.logout();
}

export async function isRunningInLineClient(): Promise<boolean> {
  await ensureLiffInit();
  return liff.isInClient();
}

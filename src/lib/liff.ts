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
function ensureInit(): Promise<void> {
  if (!liffId) {
    return Promise.reject(
      new Error("Missing VITE_LIFF_ID — copy .env.example to .env and fill it in."),
    );
  }
  if (!initPromise) initPromise = liff.init({ liffId });
  return initPromise;
}

// Resolves the current LINE profile if a session already exists — either
// because the app is running inside the LINE client (which auto-authenticates
// on init) or because the user already completed loginWithLine()'s redirect
// round-trip. Resolves null rather than prompting a login.
export async function getLineProfile(): Promise<LineProfile | null> {
  await ensureInit();
  if (!liff.isLoggedIn()) return null;
  return liff.getProfile();
}

// Outside the LINE client this redirects the whole page to LINE's login
// screen and back — nothing after this call runs until that round-trip
// completes on the next page load, so don't await it expecting a return value.
export async function loginWithLine() {
  await ensureInit();
  if (!liff.isLoggedIn()) liff.login();
}

export async function logoutFromLine() {
  await ensureInit();
  if (liff.isLoggedIn()) liff.logout();
}

export async function isRunningInLineClient(): Promise<boolean> {
  await ensureInit();
  return liff.isInClient();
}

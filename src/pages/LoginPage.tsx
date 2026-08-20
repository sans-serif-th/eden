import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { PrimaryButton } from "../components/PrimaryButton";
import { loginWithLine } from "../lib/liff";
import { useAppState } from "../AppState";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppState();

  // Redirect once the Supabase session is actually established. This must
  // check isAuthenticated, not lineProfile — lineProfile only reflects
  // whether LIFF itself is logged in, which can be true even when the
  // Supabase token exchange has failed. Gating on lineProfile caused an
  // infinite redirect loop for exactly that case: "/" bounces to "/login"
  // because isAuthenticated is false, "/login" immediately bounces back to
  // "/" because lineProfile is true, forever — fast enough to hit Safari's
  // history.replaceState() rate limit and crash the page blank.
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    // Outside the LINE client this navigates the whole page away to LINE's
    // login screen and back — control doesn't return here synchronously.
    void loginWithLine();
  };

  return (
    <ScreenShell>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <img
          src="/login-illustration.png"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <img
          src="/eden-logo.svg"
          alt="Eden"
          className="absolute top-[30%] left-1/2 w-[75%] max-w-[295px] -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-white via-white/80 to-transparent px-6 pt-32 pb-6">
          <PrimaryButton onClick={handleLogin} className="!bg-[#06C755]">
            เข้าสู่ระบบด้วย LINE
          </PrimaryButton>
          <p className="text-center text-[16px] text-ink-faint">
            การเข้าสู่ระบบถือว่ายอมรับข้อตกลงการใช้งาน
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}

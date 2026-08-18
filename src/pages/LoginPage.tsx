import { useNavigate } from "react-router-dom";
import { ScreenShell } from "../components/ScreenShell";
import { PrimaryButton } from "../components/PrimaryButton";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: wire real LIFF login once the LINE channel exists (see CONTEXT.md).
    navigate("/");
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

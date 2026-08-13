import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/store/toastStore";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!form.email || !form.password) {
      showToast({
        type: "error",
        timeout: 3000,
        message: "Vui lòng điền đầy đủ thông tin đăng nhập.",
        title: "Lỗi đăng nhập",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: form.email, password: form.password });
    } catch (err: any) {
      showToast({
        type: "error",
        timeout: 3000,
        message:
          err instanceof Error
            ? err.message
            : "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
        title: "Lỗi đăng nhập",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen overflow-hidden font-['DM_Sans']`}>
      <div
        className={`relative hidden flex-1 items-center justify-center overflow-hidden p-16 md:flex`}
      >
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute -top-20 -left-20 h-105 w-105 animate-pulse rounded-full bg-indigo-600/30 blur-[80px]" />
        <div className="absolute -right-15 -bottom-15 h-75 w-75 animate-pulse rounded-full bg-cyan-600/30 blur-[80px] delay-700" />

        <div className="relative z-10 w-full max-w-105 space-y-12">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5.5" />
            <span className="font-['Syne'] text-xl font-extrabold tracking-[0.12em] uppercase">
              Wio Admin
            </span>
          </div>

          <div className="space-y-4">
            <h2
              className={`font-['Syne'] text-4xl leading-tight font-bold md:text-5xl `}
            >
              Hệ thống quản lý thiệp online.
            </h2>
            <p className={`text-base leading-relaxed`}>Hệ thống quản lý</p>
          </div>

          <div className="flex gap-4 opacity-40">
            <div className="h-1.5 w-12 rounded-full bg-indigo-500" />
            <div className="h-1.5 w-12 rounded-full bg-cyan-500" />
            <div className="h-1.5 w-12 rounded-full bg-indigo-500/30" />
          </div>
        </div>
      </div>

      <div
        className={`flex w-full items-center justify-center p-10 md:w-120 md:p-12 `}
      >
        <div className="mx-auto w-full max-w-[384px]">
          <div className="mb-10">
            <h1 className={`mb-2 text-3xl font-bold`}>Chào mừng trở lại</h1>
            <p className={`text-sm`}>Nhập thông tin quản trị để tiếp tục</p>
          </div>

          <form className="space-y-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-extrabold tracking-widest text-indigo-500 uppercase font-['DM_Sans']">
                Email hoặc số điện thoại
              </label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Nhập email hoặc số điện thoại"
                type="text"
                className={`w-full rounded-none! border-t-0! border-r-0! border-b-[1.5px]! border-l-0! bg-transparent! px-0! py-2! shadow-none! h-auto! transition-colors focus-visible:border-indigo-500! focus-visible:ring-0! ${
                  submitted && !form.email
                    ? "border-red-500!"
                    : "border-slate-200!"
                }`}
              />
              {submitted && !form.email && (
                <small className="mt-1 text-[12px] text-red-500">
                  Vui lòng nhập email hoặc số điện thoại.
                </small>
              )}
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <label className="ml-1 text-sm font-extrabold tracking-[0.15em] text-indigo-500 uppercase font-['DM_Sans']">
                Mật khẩu
              </label>
              <div className="relative w-full">
                <Input
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="Vui lòng nhập mật khẩu"
                  className={`w-full rounded-none! border-t-0! border-r-0! border-b-[1.5px]! border-l-0! bg-transparent! px-0! py-2! shadow-none! h-auto! transition-colors focus-visible:border-indigo-500! focus-visible:ring-0! ${
                    submitted && !form.password
                      ? "border-red-500!"
                      : "border-slate-200!"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600`}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {submitted && !form.password && (
                <small className="mt-1 text-[12px] font-medium text-red-500">
                  Vui lòng nhập mật khẩu.
                </small>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="default"
              className="w-full py-2.5! text-sm! font-extrabold! tracking-[0.15em]! uppercase! font-['DM_Sans']! "
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang thực hiện đăng nhập
                </>
              ) : (
                "Đăng nhập hệ thống"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

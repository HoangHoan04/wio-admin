import { ROUTES } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/store/toastStore';
import { tokenCache } from '@/utils';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

/* ============================================================
 * TYPES
 * ============================================================ */
interface LoginForm {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

/* ============================================================
 * COMPONENT
 * ============================================================ */
export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const clearSession = useAuthStore((s) => s.clearSession);
  const { showToast } = useToast();

  useEffect(() => {
    if (tokenCache.isSessionExpired()) {
      clearSession();
      return;
    }
    if (tokenCache.isAuthenticated()) {
      navigate(ROUTES.MAIN.HOME.path, { replace: true });
    }
  }, [navigate, clearSession]);

  /* --------------------------------------------------------
   * VALIDATE
   * -------------------------------------------------------- */
  const validate = (values: LoginForm): LoginFormErrors => {
    const next: LoginFormErrors = {};
    if (!values.email.trim()) {
      next.email = 'Vui lòng nhập email hoặc số điện thoại.';
    }
    if (!values.password) {
      next.password = 'Vui lòng nhập mật khẩu.';
    }
    return next;
  };

  /* --------------------------------------------------------
   * HANDLE SUBMIT
   * -------------------------------------------------------- */
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showToast({
        type: 'error',
        timeout: 3000,
        message: 'Vui lòng điền đầy đủ thông tin đăng nhập.',
        title: 'Lỗi đăng nhập',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(ROUTES.MAIN.HOME.path, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';

      showToast({
        type: 'error',
        timeout: 3000,
        message,
        title: 'Lỗi đăng nhập',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* --------------------------------------------------------
   * RENDER
   * -------------------------------------------------------- */
  return (
    <div className="flex min-h-screen overflow-hidden font-['DM_Sans']">
      {/* ------------- LEFT PANEL ------------- */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden p-16 md:flex">
        {/* Grid background */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Blur orbs */}
        <div className="absolute -top-20 -left-20 h-105 w-105 animate-pulse rounded-full bg-indigo-600/30 blur-[80px]" />
        <div className="absolute -right-15 -bottom-15 h-75 w-75 animate-pulse rounded-full bg-cyan-600/30 blur-[80px] delay-700" />

        <div className="relative z-10 w-full max-w-105 space-y-12">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5.5" />
            <span className="font-['Syne'] text-xl font-extrabold tracking-[0.12em] uppercase">
              InviGo Admin
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="font-['Syne'] text-4xl leading-tight font-bold md:text-5xl">
              Hệ thống quản lý thiệp cưới online.
            </h2>
            <p className="text-base leading-relaxed">
              Quản lý thiệp, khách mời, gói dịch vụ và nội dung hệ thống.
            </p>
          </div>

          <div className="flex gap-4 opacity-40">
            <div className="h-1.5 w-12 rounded-full bg-indigo-500" />
            <div className="h-1.5 w-12 rounded-full bg-cyan-500" />
            <div className="h-1.5 w-12 rounded-full bg-indigo-500/30" />
          </div>
        </div>
      </div>

      {/* ------------- RIGHT PANEL ------------- */}
      <div className="flex w-full items-center justify-center p-10 md:w-120 md:p-12">
        <div className="mx-auto w-full max-w-[384px]">
          {/* Header */}
          <div className="mb-10">
            <h1 className="mb-2 text-3xl font-bold">Chào mừng trở lại</h1>
            <p className="text-sm">Nhập thông tin quản trị để tiếp tục</p>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={handleLogin} noValidate>
            {/* --- EMAIL --- */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-extrabold tracking-widest text-indigo-500 uppercase"
              >
                Email hoặc số điện thoại
              </label>
              <Input
                id="email"
                name="email"
                autoComplete="username"
                autoFocus
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Nhập email hoặc số điện thoại"
                type="text"
                className={`w-full rounded-none! border-t-0! border-r-0! border-b-[1.5px]! border-l-0! bg-transparent! px-0! py-2! shadow-none! h-auto! transition-colors focus-visible:border-indigo-500! focus-visible:ring-0! ${
                  errors.email ? 'border-red-500!' : 'border-slate-200!'
                }`}
              />
              {errors.email && (
                <small className="mt-1 text-[12px] text-red-500">
                  {errors.email}
                </small>
              )}
            </div>

            {/* --- PASSWORD --- */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="ml-1 text-sm font-extrabold tracking-[0.15em] text-indigo-500 uppercase"
              >
                Mật khẩu
              </label>
              <div className="relative w-full">
                <Input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Vui lòng nhập mật khẩu"
                  className={`w-full rounded-none! border-t-0! border-r-0! border-b-[1.5px]! border-l-0! bg-transparent! px-0! py-2! shadow-none! h-auto! transition-colors focus-visible:border-indigo-500! focus-visible:ring-0! ${
                    errors.password ? 'border-red-500!' : 'border-slate-200!'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <small className="mt-1 text-[12px] font-medium text-red-500">
                  {errors.password}
                </small>
              )}
            </div>

            {/* --- SUBMIT --- */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="default"
              className="w-full py-2.5! text-sm! font-extrabold! tracking-[0.15em]! uppercase!"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Đang đăng nhập
                </>
              ) : (
                'Đăng nhập hệ thống'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
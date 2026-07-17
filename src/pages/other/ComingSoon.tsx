import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Bell, CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Facebook from "@/assets/icons/facebook.svg";
import Linkedin from "@/assets/icons/linkedin.svg";
import Twitter from "@/assets/icons/twitter.svg";
import bgComingSoon from "@/assets/images/bg-coming-soon.jpg";
import { ROUTES } from "@/common/constants";

const LAUNCH_DATE = new Date("2026-12-31T00:00:00");

function useCountdown(target: Date) {
  const calc = React.useCallback(() => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [target]);
  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-16 sm:min-w-19">
      <div className="relative w-full aspect-square rounded-xl border border-white/15 bg-white/6 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent" />
        <span className="relative z-10 text-2xl sm:text-3xl font-black tabular-nums text-white">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/60">
        {label}
      </span>
    </div>
  );
}

interface ComingSoonProps {
  title?: string;
  description?: string;
  launchDate?: Date;
  backgroundImageUrl?: string;
}

export default function ComingSoon({
  description,
  launchDate = LAUNCH_DATE,
  backgroundImageUrl,
}: ComingSoonProps = {}) {
  const navigate = useNavigate();
  const { days, hours, minutes, seconds } = useCountdown(launchDate);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 md:p-16 text-white overflow-hidden bg-cover bg-center select-none"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${backgroundImageUrl || bgComingSoon})`,
      }}
    >
      <header className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative size-8 border-2 border-white/90 flex items-center justify-center">
            <div className="absolute -bottom-1.5 -right-1.5 size-8 border-2 border-white/40 pointer-events-none" />
          </div>
          <span className="text-sm font-black tracking-[0.2em] uppercase text-white/90">
            Coming Soon
          </span>
        </div>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_auto_1fr] items-center gap-8 lg:gap-16 my-auto max-w-6xl w-full mx-auto pt-12 pb-8">
        <div className="relative flex flex-col items-start text-left">
          <div className="absolute top-[-10%] left-[65%] w-[22%] h-[80%] bg-white/10 backdrop-blur-[2px] pointer-events-none hidden sm:block" />

          <h1 className="text-[13vw] sm:text-[7vw] lg:text-[7.5vw] font-black tracking-wider uppercase leading-[0.95] font-sans antialiased text-white drop-shadow-md">
            We Are <br />
            Coming <br />
            Soon<span className="text-white/60">!</span>
          </h1>
        </div>

        <div className="hidden lg:block h-72 w-px bg-linear-to-b from-white/10 via-white/50 to-white/10" />

        <div
          id="contact"
          className="flex flex-col items-start text-left max-w-md space-y-8"
        >
          <div className="flex items-center gap-2 sm:gap-3 py-1">
            <CountdownUnit value={days} label={"Ngày"} />
            <span className="text-xl font-black text-white/20 mb-4 animate-pulse">
              :
            </span>
            <CountdownUnit value={hours} label={"Giờ"} />
            <span className="text-xl font-black text-white/20 mb-4 animate-pulse">
              :
            </span>
            <CountdownUnit value={minutes} label={"Phút"} />
            <span className="text-xl font-black text-white/20 mb-4 animate-pulse">
              :
            </span>
            <CountdownUnit value={seconds} label={"Giây"} />
          </div>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light tracking-wide">
            {description ||
              "Sản phẩm của chúng tôi đang được hoàn thiện và sẽ sớm ra mắt. Hãy đăng ký để nhận thông báo sớm nhất."}
          </p>

          <div className="w-full min-h-13">
            {!subscribed ? (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={"Nhập email của bạn"}
                  required
                />
                <Button type="submit">
                  <Bell className="size-3.5 mr-2" />
                  {"Đăng ký nhận thông báo"}
                </Button>
              </form>
            ) : (
              <div className="inline-flex items-center gap-2.5 px-5 py-3 border border-white/20 bg-white/10 text-white text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="size-4 text-white" />
                {"Cảm ơn bạn! Chúng tôi sẽ thông báo sớm nhất."}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            {[
              { src: Facebook, alt: "Facebook", link: "#" },
              { src: Twitter, alt: "Twitter", link: "#" },
              { src: Linkedin, alt: "Linkedin", link: "#" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                className="size-8 flex items-center justify-center"
              >
                <img src={social.src} alt={social.alt} />
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full flex justify-between items-center text-[10px] tracking-widest text-white/40 uppercase font-semibold">
        <div>© 2026 Creative Studio.</div>
        <Button
          variant="link"
          size="sm"
          onClick={() => navigate(ROUTES.MAIN.HOME.path)}
          className="gap-2 text-white/40 hover:text-white text-[10px] tracking-widest uppercase p-0 h-auto"
        >
          <ArrowLeft className="size-3.5" />
          {"Về trang chủ"}
        </Button>
      </footer>
    </div>
  );
}

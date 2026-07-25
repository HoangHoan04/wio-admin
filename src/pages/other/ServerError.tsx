import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  Home,
  Mail,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ServerError({
  error,
  onReset,
  autoRetry = false,
  autoRetrySeconds = 15,
  supportEmail = "tiemcuoitanthoi@hoanghoantech.vn",
}: {
  error?: Error | null;
  onReset?: () => void;
  autoRetry?: boolean;
  autoRetrySeconds?: number;
  supportEmail?: string;
} = {}) {
  const navigate = useNavigate();
  const $t = {
    title: "Máy chủ đang gặp sự cố",
    desc: "Có vẻ như máy chủ của chúng tôi đang tạm thời quá tải hoặc gặp trục trặc. Đội ngũ kỹ thuật đã được thông báo và đang xử lý.",
    goBack: "Quay lại",
    tryAgain: "Thử lại",
    retrying: "Đang thử lại...",
    goHome: "Về trang chủ",
    help: "Nếu sự cố vẫn tiếp diễn, vui lòng liên hệ bộ phận hỗ trợ qua email bên dưới.",
    autoRetryOn: (s: number) => `Tự động thử lại sau ${s}s`,
    cancelAutoRetry: "Huỷ",
    copyDetails: "Sao chép chi tiết",
    copied: "Đã sao chép!",
    report: "Báo cáo sự cố",
    online: "Trực tuyến",
    offline: "Ngoại tuyến",
    occurredAt: "Xảy ra lúc",
    agoSuffix: "trước",
  };

  const [retrying, setRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [countdown, setCountdown] = useState<number | null>(
    autoRetry ? autoRetrySeconds : null,
  );
  const [elapsed, setElapsed] = useState(0);
  const [errorTime] = useState(() => new Date());

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - errorTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [errorTime]);

  const handleRetry = () => {
    setRetrying(true);
    setCountdown(null);
    setTimeout(() => {
      setRetrying(false);
      if (onReset) onReset();
      else window.location.reload();
    }, 900);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setTimeout(() => {
        setRetrying(true);
        setCountdown(null);
        setTimeout(() => {
          setRetrying(false);
          if (onReset) onReset();
          else window.location.reload();
        }, 900);
      }, 0);
      return;
    }
    const id = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, onReset]);

  const handleCopyDetails = async () => {
    const details = [
      `Mã lỗi: 500 Internal Server Error`,
      `Thời điểm: ${errorTime.toLocaleString("vi-VN")}`,
      `Đường dẫn: ${typeof window !== "undefined" ? window.location.href : ""}`,
      error?.message ? `Chi tiết: ${error.message}` : null,
      typeof navigator !== "undefined"
        ? `User-Agent: ${navigator.userAgent}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { 
      //! empty */
     }
  };

  const handleReport = () => {
    const subject = encodeURIComponent("Báo lỗi 500 - Server Error");
    const body = encodeURIComponent(
      [
        `Mô tả sự cố:`,
        ``,
        `— Không chỉnh sửa phần dưới —`,
        `Thời điểm: ${errorTime.toLocaleString("vi-VN")}`,
        `Đường dẫn: ${typeof window !== "undefined" ? window.location.href : ""}`,
        error?.message ? `Chi tiết lỗi: ${error.message}` : ``,
      ].join("\n"),
    );
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  const formatAgo = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return `${m}p ${s % 60}s`;
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0d12] text-[#e8ecf1] flex flex-col md:flex-row overflow-hidden">
      <style>{`
        @keyframes se500-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(420%); }
        }
        @keyframes se500-flicker {
          0%, 19%, 21%, 23%, 55%, 100% { opacity: 1; }
          20%, 22%, 56% { opacity: 0.55; }
        }
        @keyframes se500-glitch {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, 0); }
          80% { transform: translate(1px, 1px); }
        }
        @keyframes se500-spark {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-46px) scale(0.3); opacity: 0; }
        }
        @keyframes se500-crack {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.8; }
        }
        .se500-flicker { animation: se500-flicker 4.5s infinite; }
        .se500-scan { animation: se500-scan 3.2s linear infinite; }
        .se500-glitch-text {
          animation: se500-glitch 2.6s infinite;
          text-shadow: 2px 0 #ff5d5d, -2px 0 #43d9c8;
        }
        .se500-spark { animation: se500-spark 1.8s ease-out infinite; }
        .se500-crack { animation: se500-crack 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .se500-flicker, .se500-scan, .se500-glitch-text, .se500-spark, .se500-crack {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative w-full md:w-[46%] md:min-h-screen flex items-center justify-center bg-[#05070a] border-b md:border-b-0 md:border-r border-[#1c222c] px-8 py-14 md:py-0">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#43d9c8 1px, transparent 1px), linear-gradient(90deg, #43d9c8 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-md">
          <div className="se500-glitch-text font-mono font-black text-[6.5rem] md:text-[8rem] leading-none tracking-tighter select-none">
            500
          </div>

          <svg
            viewBox="0 0 260 200"
            className="w-56 md:w-64 h-auto"
            aria-hidden="true"
          >
            <rect
              x="30"
              y="20"
              width="200"
              height="140"
              rx="14"
              fill="#11151c"
              stroke="#2a3140"
              strokeWidth="2"
            />
            <clipPath id="se500-screen-clip">
              <rect x="46" y="36" width="168" height="108" rx="6" />
            </clipPath>
            <rect
              x="46"
              y="36"
              width="168"
              height="108"
              rx="6"
              fill="#050708"
            />
            <g clipPath="url(#se500-screen-clip)" className="se500-flicker">
              <rect
                x="46"
                y="60"
                width="168"
                height="6"
                fill="#ff5d5d"
                opacity="0.25"
              />
              <rect
                x="46"
                y="90"
                width="168"
                height="4"
                fill="#43d9c8"
                opacity="0.2"
              />
              <rect
                x="46"
                y="110"
                width="168"
                height="8"
                fill="#ff5d5d"
                opacity="0.15"
              />
              <text
                x="130"
                y="80"
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="12"
                fill="#ff8a65"
              >
                NO SIGNAL
              </text>
              <text
                x="130"
                y="98"
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="9"
                fill="#5c6674"
              >
                ERR_500 :: CONN_LOST
              </text>
              <rect
                x="46"
                y="0"
                width="168"
                height="20"
                fill="#43d9c8"
                opacity="0.12"
                className="se500-scan"
              />
            </g>
            <path
              d="M96 40 L118 70 L104 92 L134 118 L120 144"
              stroke="#c9d3df"
              strokeWidth="1.4"
              fill="none"
              opacity="0.5"
              className="se500-crack"
            />
            <path
              d="M150 50 L140 76 L162 96"
              stroke="#c9d3df"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
              className="se500-crack"
            />
            <rect
              x="110"
              y="160"
              width="40"
              height="10"
              rx="2"
              fill="#1c222c"
            />
            <rect x="90" y="170" width="80" height="8" rx="3" fill="#1c222c" />
            <circle
              cx="130"
              cy="152"
              r="3"
              fill="#ff5d5d"
              className="se500-flicker"
            />
            <circle
              cx="70"
              cy="30"
              r="2"
              fill="#ffb37a"
              className="se500-spark"
              style={{ animationDelay: "0s" }}
            />
            <circle
              cx="190"
              cy="26"
              r="1.6"
              fill="#ffb37a"
              className="se500-spark"
              style={{ animationDelay: "0.6s" }}
            />
            <circle
              cx="150"
              cy="22"
              r="1.4"
              fill="#ffb37a"
              className="se500-spark"
              style={{ animationDelay: "1.1s" }}
            />
          </svg>

          <p className="text-center text-sm text-[#7c8798] font-mono">
            hệ thống mất kết nối tạm thời
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 md:px-14 py-14">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {$t.title}
            </h1>
            <p className="text-[#a3aebd] leading-relaxed">{$t.desc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#7c8798]">
            <span className="inline-flex items-center gap-1.5">
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-[#43d9c8]" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-[#ff5d5d]" />
              )}
              {isOnline ? $t.online : $t.offline}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {$t.occurredAt} {errorTime.toLocaleTimeString("vi-VN")} ·{" "}
              {formatAgo(elapsed)} {$t.agoSuffix}
            </span>
          </div>

          {error?.message && (
            <div className="rounded-lg border border-[#1c222c] bg-[#0d1016] overflow-hidden">
              <div className="px-4 py-2 border-b border-[#1c222c] text-[10px] font-mono uppercase tracking-widest text-[#5c6674]">
                Chi tiết lỗi
              </div>
              <pre className="px-4 py-3 text-xs font-mono text-[#a3aebd] whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                {error.message}
              </pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleRetry}
              disabled={retrying || !isOnline}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${retrying ? "animate-spin" : ""}`}
              />
              {retrying ? $t.retrying : $t.tryAgain}
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {$t.goBack}
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="h-11 px-6 text-[#a3aebd] hover:text-white hover:bg-[#11151c] rounded-md"
            >
              <Home className="w-4 h-4 mr-2" />
              {$t.goHome}
            </Button>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {countdown !== null ? (
              <>
                <span className="font-mono text-[#ff8a65]">
                  {$t.autoRetryOn(countdown)}
                </span>
                <button
                  onClick={() => setCountdown(null)}
                  className="inline-flex items-center gap-1 text-[#7c8798] hover:text-white underline underline-offset-2"
                >
                  <X className="w-3.5 h-3.5" />
                  {$t.cancelAutoRetry}
                </button>
              </>
            ) : (
              <button
                onClick={() => setCountdown(autoRetrySeconds)}
                className="text-[#7c8798] hover:text-[#43d9c8] underline underline-offset-2"
              >
                {$t.autoRetryOn(autoRetrySeconds)}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-[#1c222c]">
            <button
              onClick={handleCopyDetails}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#7c8798] hover:text-white transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#43d9c8]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? $t.copied : $t.copyDetails}
            </button>
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#7c8798] hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {$t.report}
            </button>
          </div>

          <p className="text-xs text-[#5c6674]">{$t.help}</p>
        </div>
      </div>
    </div>
  );
}

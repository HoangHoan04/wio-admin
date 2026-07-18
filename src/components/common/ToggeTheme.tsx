import { Button } from "@/components/ui/button";
import useDashboardStore from "@/store/dashboardStore";
import { Laptop, Moon, Rocket, Sun } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function resolveThemeBg(theme: "light" | "dark" | "system"): {
  bg: string;
  isDark: boolean;
} {
  if (theme === "dark") return { bg: "#1c1c1c", isDark: true };
  if (theme === "light") return { bg: "#ffffff", isDark: false };
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return sysDark
    ? { bg: "#1c1c1c", isDark: true }
    : { bg: "#ffffff", isDark: false };
}

const ThemeTransitionOverlay: React.FC<{
  active: boolean;
  nextTheme: "light" | "dark" | "system" | null;
  onMidpoint: () => void;
  onComplete: () => void;
}> = ({ active, nextTheme, onMidpoint, onComplete }) => {
  const midpointFiredRef = useRef(false);
  const completeFiredRef = useRef(false);

  useEffect(() => {
    if (!active) {
      midpointFiredRef.current = false;
      completeFiredRef.current = false;
      return;
    }

    const midTimer = setTimeout(() => {
      if (!midpointFiredRef.current) {
        midpointFiredRef.current = true;
        onMidpoint();
      }
    }, 520);

    const endTimer = setTimeout(() => {
      if (!completeFiredRef.current) {
        completeFiredRef.current = true;
        onComplete();
      }
    }, 1400);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(endTimer);
    };
  }, [active, onComplete, onMidpoint]);

  if (!active || !nextTheme) return null;

  const { bg, isDark } = resolveThemeBg(nextTheme);

  const bgGradientEnd = isDark ? "#2a2a2a" : "#f0f0f0";
  const explosionCore = isDark
    ? "radial-gradient(circle, #fffbe6 0%, #ffd700 30%, #ff6b00 60%, #ff000080 100%)"
    : "radial-gradient(circle, #ff6b00 0%, #ffa500 30%, #ff4500 60%, #cc000080 100%)";
  const shockColor = isDark ? "#ffd700" : "#ff4500";
  const particleColors = isDark
    ? ["#ffd700", "#ff6b00", "#ff4500", "#ffffff"]
    : ["#ff4500", "#cc0000", "#ff6b00", "#1a1a1a"];

  return (
    <>
      <style>{`
        @keyframes tt-slideFromLeft {
          0%   { transform: translateX(-100%); }
          45%  { transform: translateX(0%); }
          55%  { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes tt-slideFromRight {
          0%   { transform: translateX(100%); }
          45%  { transform: translateX(0%); }
          55%  { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes tt-rocketLeft {
          0%   { left: -40px; opacity: 1; transform: translateY(-50%); }
          45%  { left: calc(50% - 20px); opacity: 1; transform: translateY(-50%); }
          48%  { left: calc(50% - 20px); opacity: 0; transform: translateY(-50%); }
          100% { left: calc(50% - 20px); opacity: 0; transform: translateY(-50%); }
        }
        @keyframes tt-rocketRight {
          0%   { right: -40px; opacity: 1; transform: translateY(-50%); }
          45%  { right: calc(50% - 20px); opacity: 1; transform: translateY(-50%); }
          48%  { right: calc(50% - 20px); opacity: 0; transform: translateY(-50%); }
          100% { right: calc(50% - 20px); opacity: 0; transform: translateY(-50%); }
        }
        @keyframes tt-explode {
          0%   { opacity: 0;   transform: translate(-50%, -50%) scale(0);   }
          20%  { opacity: 1;   transform: translate(-50%, -50%) scale(0.4); }
          50%  { opacity: 1;   transform: translate(-50%, -50%) scale(1);   }
          80%  { opacity: 0.6; transform: translate(-50%, -50%) scale(1.3); }
          100% { opacity: 0;   transform: translate(-50%, -50%) scale(1.6); }
        }
        @keyframes tt-shockwave {
          0%   { opacity: 0.8; transform: translate(-50%, -50%) scale(0); }
          100% { opacity: 0;   transform: translate(-50%, -50%) scale(3); }
        }
        @keyframes tt-particle {
          0%   { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: var(--ptx, 60px) var(--pty, -60px) scale(0); }
        }
      `}</style>

      {createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              background: `linear-gradient(135deg, ${bg} 0%, ${bgGradientEnd} 100%)`,
              animation:
                "tt-slideFromLeft 1.4s cubic-bezier(0.77,0,0.175,1) forwards",
              zIndex: 1,
              borderRight: isDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(0,0,0,0.08)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              background: `linear-gradient(225deg, ${bg} 0%, ${bgGradientEnd} 100%)`,
              animation:
                "tt-slideFromRight 1.4s cubic-bezier(0.77,0,0.175,1) forwards",
              zIndex: 1,
              borderLeft: isDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(0,0,0,0.08)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "50%",
              zIndex: 2,
              animation:
                "tt-rocketLeft 1.4s cubic-bezier(0.77,0,0.175,1) forwards",
              userSelect: "none",
            }}
          >
            <Rocket
              size={40}
              className="text-primary fill-primary/10"
              style={{ transform: "rotate(45deg)" }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: "50%",
              zIndex: 2,
              animation:
                "tt-rocketRight 1.4s cubic-bezier(0.77,0,0.175,1) forwards",
              userSelect: "none",
            }}
          >
            <Rocket
              size={40}
              className="text-primary fill-primary/10"
              style={{ transform: "rotate(-135deg)" }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: explosionCore,
              zIndex: 3,
              animation: "tt-explode 0.7s 0.48s ease-out forwards",
              opacity: 0,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              border: `4px solid ${shockColor}`,
              zIndex: 3,
              animation: "tt-shockwave 0.6s 0.52s ease-out forwards",
              opacity: 0,
            }}
          />

          {[
            { angle: 0, dist: 90 },
            { angle: 45, dist: 80 },
            { angle: 90, dist: 95 },
            { angle: 135, dist: 85 },
            { angle: 180, dist: 90 },
            { angle: 225, dist: 80 },
            { angle: 270, dist: 95 },
            { angle: 315, dist: 85 },
            { angle: 22, dist: 70 },
            { angle: 67, dist: 75 },
            { angle: 112, dist: 70 },
            { angle: 157, dist: 75 },
            { angle: 202, dist: 70 },
            { angle: 247, dist: 75 },
            { angle: 292, dist: 70 },
            { angle: 337, dist: 75 },
          ].map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = `${Math.round(Math.cos(rad) * p.dist)}px`;
            const ty = `${Math.round(Math.sin(rad) * p.dist)}px`;
            const color = particleColors[i % particleColors.length];
            return (
              <div
                key={i}
                style={
                  {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: i < 8 ? "12px" : "6px",
                    height: i < 8 ? "12px" : "6px",
                    borderRadius: "50%",
                    background: color,
                    zIndex: 4,
                    marginTop: i < 8 ? "-6px" : "-3px",
                    marginLeft: i < 8 ? "-6px" : "-3px",
                    opacity: 0,
                    animation: `tt-particle 0.5s ${0.5 + i * 0.02}s ease-out forwards`,
                    "--ptx": tx,
                    "--pty": ty,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>,
        document.body,
      )}
    </>
  );
};

export const ToggeTheme: React.FC = () => {
  const settings = useDashboardStore((state) => state.settings);
  const updateSettings = useDashboardStore((state) => state.updateSettings);
  const [animating, setAnimating] = useState(false);
  const [pendingTheme, setPendingTheme] = useState<
    "light" | "dark" | "system" | null
  >(null);
  const pendingThemeRef = useRef(pendingTheme);

  useEffect(() => {
    pendingThemeRef.current = pendingTheme;
  }, [pendingTheme]);

  const cycleTheme = useCallback(() => {
    if (animating) return;

    const nextThemeMap: Record<string, "light" | "dark" | "system"> = {
      light: "dark",
      dark: "system",
      system: "light",
    };
    setPendingTheme(nextThemeMap[settings.theme] || "light");
    setAnimating(true);
  }, [animating, settings.theme]);

  const handleMidpoint = useCallback(() => {
    if (pendingThemeRef.current) {
      updateSettings({ theme: pendingThemeRef.current });
    }
  }, [updateSettings]);

  const handleComplete = useCallback(() => {
    setAnimating(false);
    setPendingTheme(null);
  }, []);

  return (
    <>
      <ThemeTransitionOverlay
        active={animating}
        nextTheme={pendingTheme}
        onMidpoint={handleMidpoint}
        onComplete={handleComplete}
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={cycleTheme}
        title="Đổi giao diện"
        className="focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none select-none"
        style={{ outline: "none", border: "none", boxShadow: "none" }}
      >
        {settings.theme === "light" && <Sun className="size-4 text-primary" />}
        {settings.theme === "dark" && <Moon className="size-4 text-primary" />}
        {settings.theme === "system" && (
          <Laptop className="size-4 text-primary" />
        )}
      </Button>
    </>
  );
};

export default ToggeTheme;

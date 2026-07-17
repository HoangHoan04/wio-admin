import useDashboardStore from "@/store/dashboardStore";
import { Rocket } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const BackToTop: React.FC = () => {
  const isEnabled = useDashboardStore((state) => state.settings.backToTop);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const timer = setTimeout(() => {
      const scrollContainer =
        document.getElementById("base-view-scroll-container") ||
        document.getElementById("main-content-viewport");
      if (!scrollContainer) return;

      const handleScroll = () => {
        const scrollTop = scrollContainer.scrollTop;
        const docHeight =
          scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        setScrollProgress(progress);
        setIsVisible(scrollTop > 200);
      };

      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();

      (
        window as any as {
          _activeScrollContainer: HTMLElement;
          _activeScrollHandler: EventListener;
        }
      )._activeScrollContainer = scrollContainer;
      (
        window as any as {
          _activeScrollContainer: HTMLElement;
          _activeScrollHandler: EventListener;
        }
      )._activeScrollHandler = handleScroll;
    }, 100);

    return () => {
      clearTimeout(timer);
      const activeContainer = (
        window as any as {
          _activeScrollContainer: HTMLElement;
          _activeScrollHandler: EventListener;
        }
      )._activeScrollContainer;
      const activeHandler = (
        window as any as {
          _activeScrollContainer: HTMLElement;
          _activeScrollHandler: EventListener;
        }
      )._activeScrollHandler;
      if (activeContainer && activeHandler) {
        activeContainer.removeEventListener("scroll", activeHandler);
      }
    };
  }, [isEnabled, location.pathname]);

  const scrollToTop = () => {
    const scrollContainer =
      document.getElementById("base-view-scroll-container") ||
      document.getElementById("main-content-viewport");
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!isEnabled || !isVisible) return null;

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-8 right-8 z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center size-13 rounded-full bg-background hover:bg-muted border border-border shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer no-override"
        title="Scroll to top"
      >
        <svg className="absolute inset-0 size-full -rotate-90">
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="stroke-muted-foreground/15"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="stroke-primary transition-all duration-150"
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <Rocket
          className="size-5 text-primary transition-transform duration-300 ease-out"
          style={{
            transform: `rotate(-45deg) ${isHovered ? "scale(1.18)" : ""}`,
            transformOrigin: "center",
          }}
        />
      </button>
    </div>
  );
};

export default BackToTop;

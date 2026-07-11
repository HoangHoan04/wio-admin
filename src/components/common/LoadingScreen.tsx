import { Progress } from "@/components/ui/progress";
import useLoadingStore from "@/store/loadingStore";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

export const LoadingScreen: React.FC = () => {
  const { isLoading, message } = useLoadingStore();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 5;
        });
      }, 25);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background/25 backdrop-blur-xs transition-all duration-300 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-4 max-w-xs w-full px-6 animate-in zoom-in-95 duration-200">
        <Loader2 className="size-8 text-primary animate-spin" />

        <p className="text-xs font-semibold tracking-wider text-foreground/80 text-center w-full">
          {message || "Đang tải..."}
        </p>

        <div className="w-full">
          <Progress
            value={progress}
            className="h-1 bg-muted/20"
            indicatorClassName="bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

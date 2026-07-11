import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import React, { useEffect, useState } from "react";

export const FullScreen: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`,
          );
        });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleFullscreen}
      title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
      className="focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none select-none"
      style={{ outline: "none", border: "none", boxShadow: "none" }}
    >
      {isFullscreen ? (
        <Minimize className="size-4 text-primary" />
      ) : (
        <Maximize className="size-4 text-primary" />
      )}
    </Button>
  );
};

export default FullScreen;

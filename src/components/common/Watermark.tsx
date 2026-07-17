import useDashboardStore from "@/store/dashboardStore";
import React, { useMemo } from "react";

export const Watermark: React.FC = () => {
  const isEnabled = useDashboardStore((state) => state.settings.watermark);
  const text = useDashboardStore((state) => state.settings.watermarkText);
  const bgDataUrl = useMemo(() => {
    if (!isEnabled || !text) return "";

    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    if (!ctx) return "";

    ctx.clearRect(0, 0, 300, 200);
    ctx.font = "14px Inter, sans-serif";
    ctx.fillStyle = "rgba(150, 150, 150, 0.15)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(150, 100);
    ctx.rotate((-20 * Math.PI) / 180);
    ctx.fillText(text, 0, 0);

    return canvas.toDataURL();
  }, [isEnabled, text]);

  if (!isEnabled) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        backgroundImage: `url(${bgDataUrl})`,
        backgroundRepeat: "repeat",
      }}
    />
  );
};

export default Watermark;

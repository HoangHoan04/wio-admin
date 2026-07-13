import { cn } from "@/lib/utils";
import useDashboardStore from "@/store/dashboardStore";
import React from "react";

export const AppFooter: React.FC = () => {
  const settings = useDashboardStore((state) => state.settings);

  if (!settings.showFooter) return null;

  return (
    <footer
      className={cn(
        "w-full px-6 py-4 border-t border-border bg-background text-muted-foreground text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 select-none z-10",
        settings.fixedFooter ? "fixed bottom-0 left-0 right-0 shadow-lg" : "",
      )}
    >
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <span>© {settings.copyrightYear || "2026"}</span>
        {settings.companyWebsite ? (
          <a
            href={settings.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors font-medium underline"
          >
            {settings.companyName || "Antigravity"}
          </a>
        ) : (
          <span className="font-medium">
            {settings.companyName || "Antigravity"}
          </span>
        )}
        <span>. All rights reserved.</span>
      </div>

      {settings.icpNumber && (
        <div className="flex items-center gap-1">
          <span>ICP:</span>
          {settings.icpLink ? (
            <a
              href={settings.icpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-mono"
            >
              {settings.icpNumber}
            </a>
          ) : (
            <span className="font-mono">{settings.icpNumber}</span>
          )}
        </div>
      )}
    </footer>
  );
};

export default AppFooter;

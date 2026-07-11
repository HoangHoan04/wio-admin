import BackToTop from "@/components/common/BackToTop";
import ConfigSetting from "@/components/common/ConfigSetting";
import TabsBar from "@/components/common/TabsBar";
import Watermark from "@/components/common/Watermark";
import { cn } from "@/lib/utils";
import useDashboardStore from "@/store/dashboardStore";
import { getRouteByPath } from "@/utils";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppFooter from "./AppFooter";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";

export const AppLayout: React.FC = () => {
  const settings = useDashboardStore((state) => state.settings);
  const isMaximized = useDashboardStore((state) => state.isMaximized);
  const location = useLocation();
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [settings.theme]);

  useEffect(() => {
    if (settings.dynamicTitle) {
      const path = location.pathname;
      const route = getRouteByPath(path);
      const title =
        route?.label || "Admin Dashboard";

      document.title = title;
    }
  }, [location.pathname, settings.dynamicTitle]);

  const dynamicStyles: React.CSSProperties = {
    "--primary": settings.primaryColor,
    "--primary-foreground": "#ffffff",
    "--radius": `${settings.borderRadius}px`,
    fontFamily: `'${settings.fontFamily}', sans-serif`,
    fontSize: `${settings.bodySize}px`,
    fontWeight:
      settings.fontWeight === "light"
        ? 300
        : settings.fontWeight === "normal"
          ? 400
          : settings.fontWeight === "medium"
            ? 500
            : 600,
    filter:
      cn(
        settings.grayscale && "grayscale(100%)",
        settings.colorBlind && "contrast(120%) saturate(130%) sepia(20%)",
      ) || undefined,
  } as React.CSSProperties;

  const isRTL = settings.layoutMode === "RTL";
  const showHeader = settings.layoutMode !== "without header";
  const isBoxed =
    settings.layoutMode === "boxed" || settings.layoutMode === "horizontal box";

  const isTwoColumn = settings.layoutMode === "two column";
  const isSidebarLeft =
    !isTwoColumn &&
    settings.sidebarPosition === "left" &&
    settings.layoutMode !== "horizontal" &&
    settings.layoutMode !== "horizontal single" &&
    settings.layoutMode !== "horizontal overlay" &&
    settings.layoutMode !== "horizontal box";
  const isSidebarRight =
    !isTwoColumn &&
    settings.sidebarPosition === "right" &&
    settings.layoutMode !== "horizontal" &&
    settings.layoutMode !== "horizontal single" &&
    settings.layoutMode !== "horizontal overlay" &&
    settings.layoutMode !== "horizontal box";

  return (
    <div
      style={dynamicStyles}
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "h-screen w-screen overflow-hidden bg-background text-foreground transition-all duration-300 flex flex-col",
      )}
    >
      <style>{`
        :root {
          --primary: ${settings.primaryColor} !important;
          --color-primary: ${settings.primaryColor} !important;
          --radius: ${settings.borderRadius}px !important;
          --radius-sm: ${settings.borderRadius * 0.6}px !important;
          --radius-md: ${settings.borderRadius * 0.8}px !important;
          --radius-lg: ${settings.borderRadius}px !important;
          --radius-xl: ${settings.borderRadius * 1.4}px !important;
          --radius-2xl: ${settings.borderRadius * 1.8}px !important;
          --radius-3xl: ${settings.borderRadius * 2.2}px !important;
          --radius-4xl: ${settings.borderRadius * 2.6}px !important;
        }
        
        div:not(.no-override):not(.no-override *), 
        p:not(.no-override):not(.no-override *), 
        span:not(.no-override):not(.no-override *), 
        a:not(.no-override):not(.no-override *), 
        button:not(.no-override):not(.no-override *), 
        input:not(.no-override):not(.no-override *), 
        select:not(.no-override):not(.no-override *), 
        textarea:not(.no-override):not(.no-override *), 
        label:not(.no-override):not(.no-override *) {
          font-family: '${settings.fontFamily}', sans-serif !important;
          font-size: ${settings.bodySize}px !important;
          font-weight: ${
            settings.fontWeight === "light"
              ? 300
              : settings.fontWeight === "normal"
                ? 400
                : settings.fontWeight === "medium"
                  ? 500
                  : 600
          } !important;
          ${settings.boldText ? "font-weight: 700 !important;" : ""}
          ${settings.italicText ? "font-style: italic !important;" : ""}
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: '${settings.fontFamily}', sans-serif !important;
          font-size: ${settings.titleSize}px !important;
          ${settings.boldText ? "font-weight: 800 !important;" : "font-weight: 700 !important;"}
          ${settings.italicText ? "font-style: italic !important;" : ""}
          ${settings.uppercaseText ? "text-transform: uppercase !important;" : ""}
        }
      `}</style>

      <Watermark />
      <ConfigSetting />
      <BackToTop />
      <div
        className={cn(
          "flex flex-1 flex-row w-full h-full overflow-hidden",
          isBoxed && "max-w-7xl mx-auto shadow-xl bg-background border-x",
        )}
      >
        {!isMaximized && (isTwoColumn || isSidebarLeft) && <AppSidebar />}

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {showHeader && !isMaximized && <AppNavbar />}
          <TabsBar />
          <main
            id="main-content-viewport"
            className="flex-1 overflow-y-auto bg-muted/10 relative"
          >
            <Outlet />
          </main>
          {!isMaximized && <AppFooter />}
        </div>
        {isSidebarRight && !isMaximized && <AppSidebar />}
      </div>
    </div>
  );
};

export default AppLayout;

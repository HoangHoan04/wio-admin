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
    if (settings.dynamicTitle) {
      const path = location.pathname;
      const route = getRouteByPath(path);
      const title = route?.label || "Admin Dashboard";
      document.title = title;
    }
  }, [location.pathname, settings.dynamicTitle]);

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
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200 flex flex-col",
      )}
    >
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


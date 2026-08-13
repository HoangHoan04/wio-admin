import { ROUTES } from "@/common/constants";
import { menuItems } from "@/config/menu";
import { cn } from "@/lib/utils";
import useDashboardStore from "@/store/dashboardStore";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = useDashboardStore((state) => state.settings);
  const addTab = useDashboardStore((state) => state.addTab);

  const isCollapsed = settings.collapseSidebar;
  const isRTL = settings.layoutMode === "RTL";
  const isTwoColumn = settings.layoutMode === "two column";

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [activeParentId, setActiveParentId] = useState<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    menuItems.forEach((item) => {
      if (item.children?.some((child) => child.path === path)) {
        if (isTwoColumn) setActiveParentId(item.id);
        else setOpenMenus((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [location.pathname, isTwoColumn]);

  if (!settings.showSidebar) return null;

  const getEffectiveTheme = (): "light" | "dark" => {
    if (settings.theme === "dark") return "dark";
    if (settings.theme === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };
  const effectiveTheme = getEffectiveTheme();

  const sidebarBg =
    effectiveTheme === "dark"
      ? (settings.sidebarColorDark ?? "#1c1c1c")
      : (settings.sidebarColorLight ?? "#ffffff");

  const isSidebarDarkBg = (() => {
    if (!sidebarBg || typeof sidebarBg !== "string")
      return effectiveTheme === "dark";
    const hex = sidebarBg.replace("#", "");
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
    }
    return effectiveTheme === "dark";
  })();
  const sidebarColor = isSidebarDarkBg ? "#ffffff" : "inherit";
  if (isTwoColumn) {
    const handleIconClick = (item: any) => {
      if (item.children && item.children.length > 0) {
        setActiveParentId((prev) => (prev === item.id ? null : item.id));
      } else {
        setActiveParentId(null);
        addTab({
          id: item.id,
          path: item.path,
          label: item.label,
        });
        navigate(item.path);
      }
    };
    const handleChildClick = (child: any) => {
      addTab({
        id: child.id,
        path: child.path,
        label: child.label,
      });
      navigate(child.path);
    };
    const activeParent = menuItems.find((item) => item.id === activeParentId);
    const isCol2Open = !!activeParent;

    return (
      <div
        style={{ background: sidebarBg, color: sidebarColor }}
        className={cn(
          "h-full flex flex-row shrink-0 border-r border-border z-20 transition-all duration-300",
          isRTL ? "border-l border-r-0 flex-row-reverse" : "",
        )}
      >
        <div className="w-15 shrink-0 flex flex-col h-full overflow-hidden">
          <div
            onClick={() => navigate(ROUTES.MAIN.HOME.path)}
            className="h-16 flex items-center justify-center shrink-0 border-b border-border/20 cursor-pointer"
          >
            <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black shadow-md hover:scale-105 active:scale-95 transition-transform duration-200">
              <LayoutGrid className="size-5 animate-pulse" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="flex flex-col items-center gap-1 py-3 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const label = item.label || item.id;
                const highlighted =
                  activeParentId === item.id ||
                  item.children?.some((c) => location.pathname === c.path) ||
                  location.pathname === item.path;
                return (
                  <div key={item.id} className="relative group w-full">
                    <button
                      onClick={() => handleIconClick(item)}
                      className={cn(
                        "w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer",
                        highlighted
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-white/10",
                      )}
                    >
                      {Icon && <Icon className="size-4.5 shrink-0" />}
                    </button>
                    <div
                      className={cn(
                        "pointer-events-none absolute top-1/2 -translate-y-1/2 z-999 bg-popover text-popover-foreground text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap",
                        isRTL ? "right-full mr-2" : "left-full ml-2",
                      )}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
            isCol2Open ? "w-46.25 opacity-100" : "w-0 opacity-0",
          )}
          style={{
            background: sidebarBg,
            borderRight: isCol2Open
              ? "1px solid rgba(255,255,255,0.1)"
              : "none",
          }}
        >
          {activeParent && (
            <>
              <div className="h-16 flex items-center px-4 border-b border-border/20 shrink-0 gap-2">
                {activeParent.icon && (
                  <activeParent.icon className="size-4 shrink-0 opacity-70" />
                )}
                <span className="text-xs font-bold uppercase tracking-widest opacity-60 truncate">
                  {activeParent.label || activeParent.id}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                <div className="space-y-0.5">
                  {activeParent.path && (
                    <button
                      onClick={() => handleChildClick(activeParent)}
                      className={cn(
                        "w-full flex items-center gap-2.5 rounded-lg py-2 px-3 text-xs font-medium cursor-pointer transition-all duration-200",
                        location.pathname === activeParent.path
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "hover:bg-white/10",
                      )}
                    >
                      {activeParent.icon && (
                        <activeParent.icon className="size-3.5 shrink-0" />
                      )}
                      <span className="truncate">
                        {activeParent.label || activeParent.id}
                      </span>
                    </button>
                  )}
                  {activeParent.path &&
                    activeParent.children &&
                    activeParent.children.length > 0 && (
                      <div className="border-t border-white/10 my-1.5 mx-1" />
                    )}
                  {activeParent.children?.map((child) => {
                    const ChildIcon = child.icon;
                    const childLabel = child.label || child.id;
                    const isChildActive = location.pathname === child.path;
                    return (
                      <button
                        key={child.id}
                        onClick={() => handleChildClick(child)}
                        className={cn(
                          "w-full flex items-center gap-2.5 rounded-lg py-2 px-3 text-xs font-medium cursor-pointer transition-all duration-200",
                          isChildActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "hover:bg-white/10",
                        )}
                      >
                        {ChildIcon && (
                          <ChildIcon className="size-3.5 shrink-0" />
                        )}
                        <span className="truncate">{childLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const handleMenuClick = (item: any) => {
    if (item.children && item.children.length > 0) {
      setOpenMenus((prev) => {
        const isOpen = !!prev[item.id];
        if (settings.accordionMenu) return { [item.id]: !isOpen };
        return { ...prev, [item.id]: !isOpen };
      });
    } else {
      addTab({
        id: item.id,
        path: item.path,
        label: item.label,
      });
      navigate(item.path);
    }
  };

  const renderMenuItem = (item: any, isSub = false) => {
    if (item.isGroup) {
      const groupLabel = item.groupName || item.groupName;
      return (
        <div
          key={item.groupName}
          className="pt-4 pb-1 px-4 font-bold text-muted-foreground/90 select-none"
        >
          {!isCollapsed ? (
            <small className="text-[10px] lowercase"> {groupLabel}</small>
          ) : (
            <div className="h-px w-6 bg-border/20 mx-auto mt-2"></div>
          )}
        </div>
      );
    }
    const isActive = location.pathname === item.path;
    const isSubActive =
      item.children &&
      item.children.some((child: any) => location.pathname === child.path);
    const isOpen = !!openMenus[item.id];
    const Icon = item.icon;
    const label = item.label || item.id;
    return (
      <div key={item.id} className="w-full relative group">
        <button
          onClick={() => handleMenuClick(item)}
          className={cn(
            "w-full flex items-center justify-between rounded-lg font-medium transition-all duration-200 select-none mb-1 cursor-pointer",
            isCollapsed
              ? "justify-center p-2.5"
              : isSub
                ? "pl-8 pr-4 py-2.5 text-[13px]"
                : "px-5 py-2.5 text-[13px]",
            isActive || isSubActive
              ? "bg-primary/10 font-semibold text-primary"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {Icon && (
              <Icon
                className={cn(
                  "size-4.5 shrink-0 transition-transform duration-200",
                  isActive || isSubActive ? "text-primary" : "",
                )}
              />
            )}
            {!isCollapsed && <span className="truncate">{label}</span>}
          </div>
          {!isCollapsed && item.children && item.children.length > 0 && (
            <div>
              {isOpen ? (
                <ChevronDown className="size-4 opacity-70" />
              ) : (
                <ChevronRight
                  className={cn("size-4 opacity-70", isRTL && "rotate-180")}
                />
              )}
            </div>
          )}
        </button>
        {!isCollapsed &&
          item.children &&
          item.children.length > 0 &&
          isOpen && (
            <div className="mt-1 ml-4 flex flex-col border-l border-border transition-all duration-300">
              {item.children.map((child: any) => renderMenuItem(child, true))}
            </div>
          )}
      </div>
    );
  };

  const currentWidth = isCollapsed
    ? settings.sidebarCollapsedWidth
    : settings.sidebarWidth;
  return (
    <aside
      style={{
        width: `${currentWidth}px`,
        background: sidebarBg,
        color: sidebarColor,
      }}
      className={cn(
        "h-screen border-r border-border shrink-0 select-none transition-all duration-300 flex flex-col z-20 overflow-hidden",
        isRTL ? "border-l border-r-0" : "",
      )}
    >
      <style>{`
        .mini-solar-system {
          box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.05);
        }

        .mini-sun {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          z-index: 5;
          background: radial-gradient(circle, #fff 0%, #ff9e00 60%, #ff3c00 100%);
          box-shadow:
            0 0 12px #ff6a00,
            0 0 4px #ff3c00;
        }

        .mini-orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px dashed rgba(165, 180, 252, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: mini-spin linear infinite;
        }

        .orbit-1 {
          width: 20px;
          height: 20px;
          animation-duration: 3s;
        }
        .orbit-2 {
          width: 30px;
          height: 30px;
          animation-duration: 5s;
        }
        .orbit-3 {
          width: 40px;
          height: 40px;
          animation-duration: 8s;
        }

        .mini-planet {
          position: absolute;
          top: 0;
          left: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .planet-mercury {
          width: 3px;
          height: 3px;
          background: radial-gradient(circle at 30% 30%, #ffd18c, #cc8b3d);
        }
        .planet-earth {
          width: 4px;
          height: 4px;
          background: radial-gradient(circle at 30% 30%, #63b3ff, #1d6fd1);
          box-shadow: 0 0 4px rgba(99, 102, 241, 0.4);
        }
        .planet-mars {
          width: 3.5px;
          height: 3.5px;
          background: radial-gradient(circle at 30% 30%, #ff8f8f, #d13b3b);
        }

        @keyframes mini-spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .logo-shimmer {
          animation: logoShimmer 4s ease-in-out infinite;
        }
      `}</style>
      <div
        className={cn(
          "flex items-center h-24 shrink-0 transition-all duration-300 gap-3 border-b border-border/10",
          isCollapsed ? "justify-center px-2" : "px-6",
        )}
      >
        <div
          onClick={() => navigate(ROUTES.MAIN.HOME.path)}
          className="mini-solar-system relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-transparent cursor-pointer"
        >
          <div className="mini-sun"></div>
          <div className="mini-orbit orbit-1">
            <div className="mini-planet planet-mercury"></div>
          </div>
          <div className="mini-orbit orbit-2">
            <div className="mini-planet planet-earth"></div>
          </div>
          <div className="mini-orbit orbit-3">
            <div className="mini-planet planet-mars"></div>
          </div>
        </div>
        {!isCollapsed && (
          <div
            className="flex flex-col truncate cursor-pointer"
            onClick={() => navigate(ROUTES.MAIN.HOME.path)}
          >
            <div className="flex flex-col">
              <span className="text-[clamp(1.3rem,3vw,1.8rem)] font-bold whitespace-nowrap logo-shimmer">
                Wio
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        <div className="space-y-0.5">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import useDashboardStore, { type TabItem } from "@/store/dashboardStore";
import { getRouteByPath } from "@/utils";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Copy,
  FolderMinus,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  MinusCircle,
  MoreHorizontal,
  Pin,
  PinOff,
  RotateCw,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const TabsBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = useDashboardStore((state) => state.settings);
  const openTabs = useDashboardStore((state) => state.openTabs);
  const activeTabId = useDashboardStore((state) => state.activeTabId);
  const isMaximized = useDashboardStore((state) => state.isMaximized);

  const removeTab = useDashboardStore((state) => state.removeTab);
  const setActiveTabId = useDashboardStore((state) => state.setActiveTabId);
  const setOpenTabs = useDashboardStore((state) => state.setOpenTabs);
  const setMaximized = useDashboardStore((state) => state.setMaximized);
  const addTab = useDashboardStore((state) => state.addTab);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [pinnedTabs, setPinnedTabs] = useState<string[]>(() => {
    const saved = localStorage.getItem("pinned_tabs");
    return saved ? JSON.parse(saved) : [];
  });

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isClosingAllRef = useRef(false);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (isClosingAllRef.current) return;
    const currentPath = location.pathname;
    const matchingTab = openTabs.find((tab) => tab.path === currentPath);
    if (matchingTab && matchingTab.id !== activeTabId) {
      setActiveTabId(matchingTab.id);
    } else if (!matchingTab) {
      const route = getRouteByPath(currentPath);
      if (route && route.path === currentPath) {
        addTab({
          id: route.key,
          path: route.path,
          label: route.label,
        });
      }
    }
  }, [location.pathname, openTabs, activeTabId, setActiveTabId, addTab]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    localStorage.setItem("pinned_tabs", JSON.stringify(pinnedTabs));
  }, [pinnedTabs]);

  useEffect(() => {
    const invalidTabs = openTabs.filter((tab) => {
      if (tab.id === "dashboard" || tab.id === "HOME" || tab.path === "/")
        return false;
      const route = getRouteByPath(tab.path);
      return !route;
    });

    if (invalidTabs.length > 0) {
      invalidTabs.forEach((tab) => {
        removeTab(tab.id);
      });

      setTimeout(() => {
        const currentActive = useDashboardStore.getState().activeTabId;
        const tabs = useDashboardStore.getState().openTabs;
        const activeExists = tabs.some((t) => t.id === currentActive);
        if (!activeExists && tabs.length > 0) {
          const fallback = tabs[0];
          setActiveTabId(fallback.id);
          navigate(fallback.path);
        }
      }, 50);
    }
  }, [openTabs, removeTab, setActiveTabId, navigate]);

  useEffect(() => {
    const handleClose = () => setContextMenu(null);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, []);

  if (!settings.showTabs) return null;

  const togglePinTab = (id: string) => {
    if (pinnedTabs.includes(id)) {
      setPinnedTabs(pinnedTabs.filter((tId) => tId !== id));
    } else {
      setPinnedTabs([...pinnedTabs, id]);
    }
  };

  const closeTabById = (id: string) => {
    if (openTabs.length <= 1) return;
    removeTab(id);
    setTimeout(() => {
      const currentActive = useDashboardStore.getState().activeTabId;
      const tabs = useDashboardStore.getState().openTabs;
      const activeTab = tabs.find((tab) => tab.id === currentActive);
      if (activeTab) {
        navigate(activeTab.path);
      }
    }, 50);
  };

  const closeOtherTabs = (id: string) => {
    const target = openTabs.find((t) => t.id === id);
    if (target) {
      const keep = openTabs.filter(
        (tab) => tab.id === id || pinnedTabs.includes(tab.id),
      );
      setOpenTabs(keep);
      setActiveTabId(id);
      navigate(target.path);
    }
  };

  const closeTabsToLeft = (id: string) => {
    const index = openTabs.findIndex((t) => t.id === id);
    if (index !== -1) {
      const keep = openTabs.filter(
        (tab, idx) => idx >= index || pinnedTabs.includes(tab.id),
      );
      setOpenTabs(keep);
      const stillExists = keep.some((t) => t.id === activeTabId);
      if (!stillExists) {
        setActiveTabId(id);
        const target = openTabs.find((t) => t.id === id);
        if (target) navigate(target.path);
      }
    }
  };

  const closeTabsToRight = (id: string) => {
    const index = openTabs.findIndex((t) => t.id === id);
    if (index !== -1) {
      const keep = openTabs.filter(
        (tab, idx) => idx <= index || pinnedTabs.includes(tab.id),
      );
      setOpenTabs(keep);
      const stillExists = keep.some((t) => t.id === activeTabId);
      if (!stillExists) {
        setActiveTabId(id);
        const target = openTabs.find((t) => t.id === id);
        if (target) navigate(target.path);
      }
    }
  };

  const closeAllTabs = () => {
    isClosingAllRef.current = true;
    const keep = openTabs.filter((tab) => pinnedTabs.includes(tab.id));
    const homeTabExists = keep.some((tab) => tab.path === "/");

    if (!homeTabExists) {
      keep.unshift({
        id: "HOME",
        path: "/",
        label: "Trang chủ",
      });
    }

    setOpenTabs(keep);
    setActiveTabId("HOME");
    navigate("/");

    setTimeout(() => {
      isClosingAllRef.current = false;
    }, 100);
  };

  const duplicateTab = (id: string) => {
    const target = openTabs.find((t) => t.id === id);
    if (target) {
      const dupId = `${target.id}_dup_${Date.now()}`;
      const duplicate: TabItem = {
        id: dupId,
        path: target.path,
        label: target.label,
      };
      const index = openTabs.findIndex((t) => t.id === id);
      const updated = [...openTabs];
      updated.splice(index + 1, 0, duplicate);
      setOpenTabs(updated);
      setActiveTabId(dupId);
      navigate(target.path);
    }
  };

  const refreshTab = (id: string) => {
    const target = openTabs.find((t) => t.id === id);
    if (target) {
      navigate("/500");
      setTimeout(() => {
        navigate(target.path);
      }, 50);
    }
  };

  const refreshAllTabs = () => {
    window.location.reload();
  };

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      tabId,
    });
  };

  const handleTabClick = (tab: TabItem) => {
    setActiveTabId(tab.id);
    navigate(tab.path);
  };

  const handleDragStart = (index: number) => {
    if (!settings.dragTabs) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || !settings.dragTabs) return;
    const reorderedTabs = [...openTabs];
    const [removed] = reorderedTabs.splice(draggedIndex, 1);
    reorderedTabs.splice(index, 0, removed);
    setOpenTabs(reorderedTabs);
    setDraggedIndex(null);
  };

  const tabWidth = useMemo(() => {
    if (settings.tabStyle === "icon") return 55;
    if (settings.tabStyle === "chrome") return 150;
    return 130;
  }, [settings.tabStyle]);

  const sortedTabs = useMemo(() => {
    return [...openTabs].sort((a, b) => {
      const aPinned = pinnedTabs.includes(a.id);
      const bPinned = pinnedTabs.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [openTabs, pinnedTabs]);

  const { visibleTabs, overflowTabs } = useMemo(() => {
    const availableWidth = Math.max(100, containerWidth - 100);
    const maxVisibleCount = Math.floor(availableWidth / tabWidth);

    if (sortedTabs.length <= maxVisibleCount || maxVisibleCount <= 1) {
      return { visibleTabs: sortedTabs, overflowTabs: [] };
    }

    let visible = sortedTabs.slice(0, maxVisibleCount);
    let overflow = sortedTabs.slice(maxVisibleCount);

    const activeIndex = sortedTabs.findIndex((t) => t.id === activeTabId);
    if (activeIndex >= maxVisibleCount) {
      const activeTab = sortedTabs[activeIndex];
      visible[visible.length - 1] = activeTab;
      overflow = overflow.filter((t) => t.id !== activeTabId);
      overflow.unshift(sortedTabs[maxVisibleCount - 1]);
    }

    return { visibleTabs: visible, overflowTabs: overflow };
  }, [sortedTabs, containerWidth, tabWidth, activeTabId]);

  return (
    <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 h-12 select-none relative">
      <div
        ref={containerRef}
        className="flex items-end h-full overflow-hidden gap-1 pt-1 flex-1"
      >
        {visibleTabs.map((tab, index) => {
          const isActive = activeTabId === tab.id;
          const isPinned = pinnedTabs.includes(tab.id);
          const route = getRouteByPath(tab.path);
          const Icon = route?.icon || LayoutDashboard;
          const title = route?.label ? route.label : tab.label;

          let tabClass = "";
          if (settings.tabStyle === "chrome") {
            tabClass = cn(
              "relative px-5 py-2 text-xs font-medium cursor-pointer transition-all rounded-t-xl z-10 flex items-center gap-2 border border-b-0",
              isActive
                ? "bg-background text-foreground border-border font-semibold shadow-xs"
                : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted/80",
            );
          } else if (settings.tabStyle === "card") {
            tabClass = cn(
              "px-4 py-1.5 text-xs font-medium cursor-pointer transition-all rounded-md flex items-center gap-2 border mb-1",
              isActive
                ? "bg-primary text-primary-foreground border-primary font-semibold shadow-sm"
                : "bg-background text-muted-foreground border-border hover:bg-muted",
            );
          } else if (settings.tabStyle === "icon") {
            tabClass = cn(
              "p-2 text-xs cursor-pointer transition-all rounded-lg flex items-center justify-center border mb-1",
              isActive
                ? "bg-background text-primary border-border shadow-xs scale-105"
                : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/60",
            );
          } else {
            tabClass = cn(
              "px-4 py-2.5 text-xs font-medium cursor-pointer transition-all relative flex items-center gap-2 border-b-2 border-transparent",
              isActive
                ? "text-primary border-primary font-semibold"
                : "text-muted-foreground hover:text-foreground",
            );
          }

          return (
            <div
              key={tab.id}
              draggable={settings.dragTabs && !isPinned}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              onClick={() => handleTabClick(tab)}
              onContextMenu={(e) => handleContextMenu(e, tab.id)}
              className={cn(tabClass, "group shrink-0 relative")}
            >
              {settings.showTabIcons && <Icon className="size-3.5" />}
              {settings.tabStyle !== "icon" && (
                <span className="max-w-28 truncate">{title}</span>
              )}
              {isPinned && <Pin className="size-3 text-primary rotate-45" />}
              {openTabs.length > 1 && !isPinned && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTabById(tab.id);
                  }}
                  className="rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-all ml-1 shrink-0"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 pl-4 border-l border-border h-6 my-auto shrink-0 z-25">
        {overflowTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                title="Overflow Tabs"
                className="text-primary hover:bg-primary/10 relative font-bold"
              >
                <MoreHorizontal className="size-4 animate-pulse" />
                <span className="absolute -top-1 -right-1 bg-destructive text-white text-[9px] size-4 rounded-full flex items-center justify-center scale-90">
                  {overflowTabs.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 max-h-80 overflow-y-auto"
            >
              {overflowTabs.map((tab) => {
                const route = getRouteByPath(tab.path);
                const Icon = route?.icon || LayoutDashboard;
                const title = route?.label || tab.label || tab.id;
                const isPinned = pinnedTabs.includes(tab.id);

                return (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={cn(
                      "flex items-center justify-between text-xs cursor-pointer",
                      activeTabId === tab.id ? "bg-accent font-semibold" : "",
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Icon className="size-3.5 shrink-0" />
                      <span className="truncate">{title}</span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      {isPinned && <Pin className="size-3 text-primary" />}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTabById(tab.id);
                        }}
                        className="rounded-full p-0.5 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={refreshAllTabs}
          title="Refresh All Tabs"
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCw className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setMaximized(!isMaximized)}
          title={isMaximized ? "Thu nhỏ" : "Phóng to"}
          className="text-muted-foreground hover:text-foreground"
        >
          {isMaximized ? (
            <Minimize2 className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Tab Actions"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => refreshTab(activeTabId)}
              className="text-xs cursor-pointer gap-2"
            >
              <RotateCw className="size-3.5" />
              <span>Làm mới</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => closeTabById(activeTabId)}
              disabled={openTabs.length <= 1}
              className="text-xs cursor-pointer gap-2"
            >
              <X className="size-3.5" />
              <span>Đóng tab hiện tại</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => closeTabsToLeft(activeTabId)}
              className="text-xs cursor-pointer gap-2"
            >
              <ArrowLeft className="size-3.5" />
              <span>Đóng các tab bên trái</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => closeTabsToRight(activeTabId)}
              className="text-xs cursor-pointer gap-2"
            >
              <ArrowRight className="size-3.5" />
              <span>Đóng các tab bên phải</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => closeOtherTabs(activeTabId)}
              className="text-xs cursor-pointer gap-2"
            >
              <MinusCircle className="size-3.5" />
              <span>Đóng các tab khác</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={closeAllTabs}
              className="text-xs cursor-pointer gap-2 text-destructive focus:bg-destructive/10"
            >
              <FolderMinus className="size-3.5 text-destructive" />
              <span>Đóng tất cả các tab</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
          }}
          className="w-52 rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              refreshTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground select-none outline-none"
          >
            <RotateCw className="size-3.5" />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => {
              closeTabById(contextMenu.tabId);
              setContextMenu(null);
            }}
            disabled={openTabs.length <= 1}
            className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground disabled:opacity-50 select-none outline-none"
          >
            <X className="size-3.5" />
            <span>Đóng</span>
          </button>
          <DropdownMenuSeparator />
          <button
            onClick={() => {
              closeTabsToLeft(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground select-none outline-none"
          >
            <ArrowLeft className="size-3.5" />
            <span>Đóng các tab bên trái</span>
          </button>
          <button
            onClick={() => {
              closeTabsToRight(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground select-none outline-none"
          >
            <ArrowRight className="size-3.5" />
            <span>Đóng các tab bên phải</span>
          </button>
          <button
            onClick={() => {
              closeOtherTabs(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground select-none outline-none"
          >
            <MinusCircle className="size-3.5" />
            <span>Đóng các tab khác</span>
          </button>
          <button
            onClick={() => {
              closeAllTabs();
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground select-none outline-none text-destructive"
          >
            <FolderMinus className="size-3.5 text-destructive" />
            <span>Đóng tất cả các tab</span>
          </button>
          <DropdownMenuSeparator />
          <button
            onClick={() => {
              duplicateTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground select-none outline-none"
          >
            <Copy className="size-3.5" />
            <span>Nhân đôi tab hiện tại</span>
          </button>
          <button
            onClick={() => {
              togglePinTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground select-none outline-none"
          >
            {pinnedTabs.includes(contextMenu.tabId) ? (
              <>
                <PinOff className="size-3.5" />
                <span>Bỏ ghim</span>
              </>
            ) : (
              <>
                <Pin className="size-3.5" />
                <span>Ghim</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TabsBar;

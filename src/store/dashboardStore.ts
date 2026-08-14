import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TabItem {
  id: string;
  path: string;
  label: string;
}

export interface DashboardSettings {
  dynamicTitle: boolean;
  backToTop: boolean;
  watermark: boolean;
  watermarkText: string;
  theme: "light" | "dark" | "system";
  colorBlind: boolean;
  grayscale: boolean;
  borderRadius: number;
  fontFamily: string;
  fontWeight: "light" | "normal" | "medium" | "semibold";
  titleSize: number;
  bodySize: number;
  boldText: boolean;
  italicText: boolean;
  uppercaseText: boolean;
  primaryColor: string;
  navbarColorType: "solid" | "gradient";
  navbarColorLight: string;
  navbarColorDark: string;
  sidebarColorType: "solid" | "gradient";
  sidebarColorLight: string;
  sidebarColorDark: string;
  layoutMode:
    | "horizontal"
    | "detached"
    | "modern"
    | "two column"
    | "hovered"
    | "boxed"
    | "horizontal single"
    | "horizontal overlay"
    | "horizontal box"
    | "menu aside"
    | "transparent"
    | "without header"
    | "RTL";
  sidebarPosition: "left" | "right" | "top";
  configPosition: "left" | "right";
  showSidebar: boolean;
  collapseSidebar: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  accordionMenu: boolean;
  showTabs: boolean;
  persistTabs: boolean;
  dragTabs: boolean;
  showTabIcons: boolean;
  showMaximizeTab: boolean;
  tabStyle: "chrome" | "card" | "icon" | "simple";
  maxTabs: number;
  pageProgress: boolean;
  pageLoader: boolean;
  pageTransition: boolean;
  transitionEffect: string;
  showFooter: boolean;
  fixedFooter: boolean;
  companyName: string;
  companyWebsite: string;
  copyrightYear: string;
  icpNumber: string;
  icpLink: string;
}

export interface DashboardState {
  settings: DashboardSettings;
  openTabs: TabItem[];
  activeTabId: string;
  isConfigOpen: boolean;
  isMaximized: boolean;
  updateSettings: (newSettings: Partial<DashboardSettings>) => void;
  setConfigOpen: (isOpen: boolean) => void;
  setMaximized: (isMax: boolean) => void;
  resetSettings: () => void;
  addTab: (tab: TabItem) => void;
  removeTab: (id: string) => void;
  setActiveTabId: (id: string) => void;
  setOpenTabs: (tabs: TabItem[]) => void;
  clearTabs: () => void;
}

export const defaultSettings: DashboardSettings = {
  dynamicTitle: true,
  backToTop: true,
  watermark: false,
  watermarkText: "ADMIN DASHBOARD",

  theme: "light",
  colorBlind: false,
  grayscale: false,
  borderRadius: 8,
  fontFamily: "Inter",
  fontWeight: "normal",
  titleSize: 20,
  bodySize: 14,
  boldText: false,
  italicText: false,
  uppercaseText: false,
  primaryColor: "#3b82f6",
  navbarColorType: "solid",
  navbarColorLight: "#ffffff",
  navbarColorDark: "#1c1c1c",
  sidebarColorType: "solid",
  sidebarColorLight: "#ffffff",
  sidebarColorDark: "#1c1c1c",

  layoutMode: "modern",
  sidebarPosition: "left",
  configPosition: "right",

  showSidebar: true,
  collapseSidebar: false,
  sidebarWidth: 260,
  sidebarCollapsedWidth: 70,
  accordionMenu: true,

  showTabs: true,
  persistTabs: true,
  dragTabs: true,
  showTabIcons: true,
  showMaximizeTab: true,
  tabStyle: "chrome",
  maxTabs: 10,

  pageProgress: true,
  pageLoader: false,
  pageTransition: true,
  transitionEffect: "fade-up",

  showFooter: true,
  fixedFooter: false,
  companyName: "HOANG HOAN TECHNOLOGY",
  companyWebsite: "https://hoanghoantechnology.ai",
  copyrightYear: "2026",
  icpNumber: "ICP-VN-20260707",
  icpLink: "https://icp.hoanghoantechnology.ai",
};

interface PersistedDashboardState {
  settings: DashboardSettings;
  openTabs: TabItem[];
  activeTabId: string;
}

interface LegacyPersistedState {
  settings?: Record<string, any>;
  openTabs?: TabItem[];
  activeTabId?: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const raw = (hex || "").replace("#", "").trim();
  if (raw.length !== 6) return `rgba(59, 130, 246, ${alpha})`;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shadeColor(hex: string, percent: number): string {
  const raw = (hex || "").replace("#", "").trim();
  if (raw.length !== 6) return hex;
  const num = parseInt(raw, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + Math.round(255 * (percent / 100)));
  const g = clamp(((num >> 8) & 0xff) + Math.round(255 * (percent / 100)));
  const b = clamp((num & 0xff) + Math.round(255 * (percent / 100)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function applyTheme(s: DashboardSettings): void {
  if (typeof window === "undefined" || !document.documentElement) return;
  const root = document.documentElement;
  const isDark =
    s.theme === "dark" ||
    (s.theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);
  root.setAttribute("data-layout", s.layoutMode || "modern");
  root.setAttribute("data-sidebar-position", s.sidebarPosition || "left");
  root.setAttribute("data-config-position", s.configPosition || "right");

  if (s.grayscale) {
    root.style.setProperty("filter", "grayscale(100%)");
  } else if (s.colorBlind) {
    root.style.setProperty(
      "filter",
      "contrast(120%) saturate(130%) sepia(20%)",
    );
  } else {
    root.style.removeProperty("filter");
  }

  root.style.setProperty("--primary", s.primaryColor);
  root.style.setProperty("--color-primary", s.primaryColor);
  root.style.setProperty("--primary-hover", shadeColor(s.primaryColor, -12));
  root.style.setProperty("--primary-active", shadeColor(s.primaryColor, -22));
  root.style.setProperty(
    "--primary-muted",
    hexToRgba(s.primaryColor, isDark ? 0.18 : 0.12),
  );
  root.style.setProperty("--ring", hexToRgba(s.primaryColor, 0.4));
  root.style.setProperty(
    "--shadow-primary",
    `0 8px 20px ${hexToRgba(s.primaryColor, 0.28)}`,
  );

  root.style.setProperty("--radius", `${s.borderRadius}px`);
  root.style.setProperty("--radius-sm", `${s.borderRadius * 0.6}px`);
  root.style.setProperty("--radius-md", `${s.borderRadius * 0.8}px`);
  root.style.setProperty("--radius-lg", `${s.borderRadius}px`);
  root.style.setProperty("--radius-xl", `${s.borderRadius * 1.4}px`);
  root.style.setProperty("--radius-2xl", `${s.borderRadius * 1.8}px`);
  root.style.setProperty("--radius-3xl", `${s.borderRadius * 2.2}px`);
  root.style.setProperty("--radius-4xl", `${s.borderRadius * 2.6}px`);

  root.style.setProperty("--sidebar-width", `${s.sidebarWidth}px`);
  root.style.setProperty(
    "--sidebar-collapsed-width",
    `${s.sidebarCollapsedWidth}px`,
  );
  root.style.setProperty("--navbar-height", "64px");
  root.style.setProperty("--footer-height", "56px");

  if (s.fontFamily) {
    root.style.setProperty("--font-family", `'${s.fontFamily}', sans-serif`);
  }
  root.style.setProperty("--title-size", `${s.titleSize}px`);
  root.style.setProperty("--body-size", `${s.bodySize}px`);
  root.style.removeProperty("font-size");

  const body = document.body;
  if (body) {
    body.style.fontSize = `${s.bodySize}px`;
    if (s.fontFamily) body.style.fontFamily = `'${s.fontFamily}', sans-serif`;
  }

  const w =
    s.fontWeight === "light"
      ? "300"
      : s.fontWeight === "normal"
        ? "400"
        : s.fontWeight === "medium"
          ? "500"
          : "600";
  const fw = s.boldText ? "700" : w;
  root.style.fontWeight = fw;
  if (body) body.style.fontWeight = fw;

  if (s.italicText) {
    root.style.fontStyle = "italic";
    if (body) body.style.fontStyle = "italic";
  } else {
    root.style.fontStyle = "normal";
    if (body) body.style.fontStyle = "normal";
  }

  const navbarColor = isDark ? s.navbarColorDark : s.navbarColorLight;
  const sidebarColor = isDark ? s.sidebarColorDark : s.sidebarColorLight;
  root.style.setProperty("--navbar-bg", navbarColor);
  root.style.setProperty("--sidebar-bg", sidebarColor);
  root.setAttribute("data-navbar-color-type", s.navbarColorType || "solid");
  root.setAttribute("data-sidebar-color-type", s.sidebarColorType || "solid");
  root.classList.toggle("s-uppercase", !!s.uppercaseText);
  root.classList.toggle("s-show-footer", !!s.showFooter);
  root.classList.toggle("s-fixed-footer", !!s.fixedFooter);
  root.classList.toggle("s-show-sidebar", !!s.showSidebar);
  root.classList.toggle("s-collapse-sidebar", !!s.collapseSidebar);
  root.classList.toggle("s-show-tabs", !!s.showTabs);
  root.classList.toggle("s-watermark", !!s.watermark);
}

export const useDashboardStore = create<DashboardState>()(
  persist<DashboardState, [], [], PersistedDashboardState>(
    (set) => ({
      settings: defaultSettings,
      openTabs: [
        {
          id: "dashboard",
          path: "/dashboard",
          label: "Trang chủ",
        },
      ],
      activeTabId: "dashboard",
      isConfigOpen: false,
      isMaximized: false,

      updateSettings: (newSettings) =>
        set((state) => {
          const nextSettings = { ...state.settings, ...newSettings };
          applyTheme(nextSettings);
          return { settings: nextSettings };
        }),

      setConfigOpen: (isOpen) => set({ isConfigOpen: isOpen }),

      setMaximized: (isMax) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("s-maximized", isMax);
        }
        set({ isMaximized: isMax });
      },

      resetSettings: () => {
        applyTheme(defaultSettings);
        set({ settings: defaultSettings });
      },

      addTab: (tab) =>
        set((state) => {
          const exists = state.openTabs.some((t) => t.id === tab.id);
          if (exists) return { activeTabId: tab.id };

          const updated = [...state.openTabs, tab];
          if (updated.length > state.settings.maxTabs) {
            updated.shift();
          }
          return { openTabs: updated, activeTabId: tab.id };
        }),

      removeTab: (id) =>
        set((state) => {
          const { openTabs, activeTabId } = state;
          if (openTabs.length <= 1) return {};

          const filtered = openTabs.filter((t) => t.id !== id);
          let nextActive = activeTabId;

          if (activeTabId === id) {
            const index = openTabs.findIndex((t) => t.id === id);
            const nextTab = filtered[index] || filtered[index - 1];
            nextActive = nextTab ? nextTab.id : filtered[0].id;
          }

          return { openTabs: filtered, activeTabId: nextActive };
        }),

      setActiveTabId: (id) => set({ activeTabId: id }),

      setOpenTabs: (tabs) => set({ openTabs: tabs }),

      clearTabs: () =>
        set({
          openTabs: [
            {
              id: "dashboard",
              path: "/dashboard",
              label: "Trang chủ",
            },
          ],
          activeTabId: "dashboard",
        }),
    }),
    {
      name: "dashboard-store-settings",
      version: 1,
      migrate: (
        persistedState: any,
        version: number,
      ): PersistedDashboardState => {
        const state = persistedState as LegacyPersistedState;
        if (version === 0 && state && state.settings) {
          const s = state.settings;
          state.settings = {
            ...s,
            navbarColorLight:
              (s.navbarColorLight as string) ??
              (s.navbarColorValue as string) ??
              "#ffffff",
            navbarColorDark: (s.navbarColorDark as string) ?? "#1c1c1c",
            sidebarColorLight:
              (s.sidebarColorLight as string) ??
              (s.sidebarColorValue as string) ??
              "#ffffff",
            sidebarColorDark: (s.sidebarColorDark as string) ?? "#1c1c1c",
          };
          delete state.settings.navbarColorValue;
          delete state.settings.sidebarColorValue;
        }
        return {
          settings: state.settings as any as DashboardSettings,
          openTabs: state.openTabs ?? [],
          activeTabId: state.activeTabId ?? "dashboard",
        };
      },
      partialize: (state) => ({
        settings: state.settings,
        openTabs: state.settings.persistTabs
          ? state.openTabs
          : [
              {
                id: "dashboard",
                path: "/dashboard",
                label: "Trang chủ",
              },
            ],
        activeTabId: state.settings.persistTabs
          ? state.activeTabId
          : "dashboard",
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.settings) {
          applyTheme(state.settings);
        }
      },
    },
  ),
);

if (typeof window !== "undefined") {
  const initialSettings = useDashboardStore.getState().settings;
  applyTheme(initialSettings);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    const current = useDashboardStore.getState().settings;
    if (current.theme === "system") {
      applyTheme(current);
    }
  });
}

export default useDashboardStore;

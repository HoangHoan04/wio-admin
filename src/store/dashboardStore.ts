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
  bodySize: 13,
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
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setConfigOpen: (isOpen) => set({ isConfigOpen: isOpen }),

      setMaximized: (isMax) => set({ isMaximized: isMax }),

      resetSettings: () => set({ settings: defaultSettings }),

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
    },
  ),
);
export default useDashboardStore;

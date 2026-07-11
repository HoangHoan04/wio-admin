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

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
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

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      setConfigOpen: (isOpen) => set({ isConfigOpen: isOpen }),
      setMaximized: (isMax) => set({ isMaximized: isMax }),

      resetSettings: () => set({ settings: defaultSettings }),

      addTab: (tab) => {
        const { openTabs, settings } = get();
        const exists = openTabs.find((t) => t.id === tab.id);
        if (exists) {
          set({ activeTabId: tab.id });
          return;
        }

        let updatedTabs = [...openTabs];
        if (updatedTabs.length >= settings.maxTabs) {
          if (updatedTabs.length > 1) {
            updatedTabs.splice(1, 1);
          } else {
            updatedTabs.shift();
          }
        }
        updatedTabs.push(tab);
        set({ openTabs: updatedTabs, activeTabId: tab.id });
      },

      removeTab: (id) => {
        const { openTabs, activeTabId } = get();
        if (openTabs.length <= 1) return;

        const filtered = openTabs.filter((t) => t.id !== id);
        let nextActive = activeTabId;

        if (activeTabId === id) {
          const index = openTabs.findIndex((t) => t.id === id);
          const nextTab = filtered[index] || filtered[index - 1];
          nextActive = nextTab ? nextTab.id : filtered[0].id;
        }

        set({ openTabs: filtered, activeTabId: nextActive });
      },

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
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          const s = persistedState?.settings ?? {};
          persistedState.settings = {
            ...s,
            navbarColorLight:
              s.navbarColorLight ?? s.navbarColorValue ?? "#ffffff",
            navbarColorDark: s.navbarColorDark ?? "#1c1c1c",
            sidebarColorLight:
              s.sidebarColorLight ?? s.sidebarColorValue ?? "#ffffff",
            sidebarColorDark: s.sidebarColorDark ?? "#1c1c1c",
          };
          delete persistedState.settings.navbarColorValue;
          delete persistedState.settings.sidebarColorValue;
        }
        return persistedState;
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

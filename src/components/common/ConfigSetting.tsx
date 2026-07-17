import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import useDashboardStore from "@/store/dashboardStore";
import { useToast } from "@/store/toastStore";
import { Copy, LogOut, RefreshCw, Settings } from "lucide-react";
import React from "react";

const primaryColors = [
  { name: "blue", value: "#3b82f6" },
  { name: "red", value: "#ef4444" },
  { name: "yellow", value: "#f59e0b" },
  { name: "brown", value: "#78350f" },
  { name: "purple", value: "#8b5cf6" },
  { name: "pink", value: "#ec4899" },
  { name: "orange", value: "#f97316" },
  { name: "emerald", value: "#10b981" },
  { name: "teal", value: "#14b8a6" },
  { name: "indigo", value: "#6366f1" },
];

const solidColors = [
  "#ffffff",
  "#f8fafc",
  "#f0fdf4",
  "#eff6ff",
  "#fdf2f8",
  "#faf5ff",
  "#fffbeb",
  "#f0f9ff",
  "#fef2f2",
  "#f5f5f4",
];

const solidColorsDark = [
  "#1c1c1c",
  "#1e1e2e",
  "#18181b",
  "#0f172a",
  "#1a1a2e",
  "#16213e",
  "#0d1117",
  "#111827",
  "#1f2937",
  "#27272a",
];

const gradientColors = [
  "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
  "linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)",
];

const gradientColorsDark = [
  "linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 100%)",
  "linear-gradient(135deg, #0f0c29 0%, #302b63 100%)",
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  "linear-gradient(135deg, #0d0d0d 0%, #1a0533 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 100%)",
  "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
  "linear-gradient(135deg, #16222a 0%, #3a6073 100%)",
  "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
  "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
];

const layoutModes = [
  "horizontal",
  "detached",
  "modern",
  "two column",
  "hovered",
  "boxed",
  "horizontal single",
  "horizontal overlay",
  "horizontal box",
  "menu aside",
  "transparent",
  "without header",
  "RTL",
];

const transitionEffects = [
  "fade",
  "fade-side",
  "fade-up",
  "fade-down",
  "fade-zoom",
  "slide-left",
  "slide-right",
  "zoom-in",
  "zoom-out",
  "rotate",
  "flip-x",
  "flip-y",
  "bounce",
  "slide-up",
  "slide-down",
];

export const ConfigSetting: React.FC = () => {
  const isConfigOpen = useDashboardStore((state) => state.isConfigOpen);
  const setConfigOpen = useDashboardStore((state) => state.setConfigOpen);
  const settings = useDashboardStore((state) => state.settings);
  const updateSettings = useDashboardStore((state) => state.updateSettings);
  const resetSettings = useDashboardStore((state) => state.resetSettings);
  const clearTabs = useDashboardStore((state) => state.clearTabs);

  const { showToast } = useToast();

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
    showToast({
      type: "success",
      title: "Đã sao chép",
      message: "Cấu hình đã được sao chép vào clipboard",
      timeout: 3000,
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    clearTabs();
    resetSettings();
    window.location.reload();
  };

  return (
    <Sheet open={isConfigOpen} onOpenChange={setConfigOpen}>
      <SheetContent
        side={settings.configPosition}
        className="w-full sm:max-w-lg p-0 flex flex-col h-full overflow-hidden bg-background border-border no-override"
      >
        <SheetHeader className="p-6 border-b border-border flex flex-row items-center gap-2 shrink-0">
          <Settings
            className="size-5 text-primary animate-spin"
            style={{ animationDuration: "4s" }}
          />
          <SheetTitle className="text-lg font-bold">
            Cài đặt hệ thống
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 w-full min-h-0">
          <div className="px-6 py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary">Cài đặt chung</h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Tiêu đề động</span>
                <Switch
                  size="sm"
                  checked={settings.dynamicTitle}
                  onCheckedChange={(val) =>
                    updateSettings({ dynamicTitle: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Nút điều hướng lên đầu trang
                </span>
                <Switch
                  size="sm"
                  checked={settings.backToTop}
                  onCheckedChange={(val) => updateSettings({ backToTop: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Watermark hiển thị trên trang
                </span>
                <Switch
                  size="sm"
                  checked={settings.watermark}
                  onCheckedChange={(val) => updateSettings({ watermark: val })}
                />
              </div>

              {settings.watermark && (
                <div className="space-y-1.5 pl-2 border-l-2 border-primary animate-in fade-in duration-200">
                  <span className="text-[11px] text-muted-foreground">
                    Nội dung watermark
                  </span>
                  <Input
                    className="h-8 text-xs"
                    value={settings.watermarkText}
                    onChange={(e) =>
                      updateSettings({ watermarkText: e.target.value })
                    }
                    placeholder="Nội dung watermark"
                  />
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary">Giao diện</h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Theme</span>
                <Select
                  value={settings.theme}
                  onValueChange={(val: any) => updateSettings({ theme: val })}
                >
                  <SelectTrigger className="w-30 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng</SelectItem>
                    <SelectItem value="dark">Tối</SelectItem>
                    <SelectItem value="system">Hệ thống</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Chế độ mù màu</span>
                <Switch
                  size="sm"
                  checked={settings.colorBlind}
                  onCheckedChange={(val) => updateSettings({ colorBlind: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Chế độ xám (Grayscale)
                </span>
                <Switch
                  size="sm"
                  checked={settings.grayscale}
                  onCheckedChange={(val) => updateSettings({ grayscale: val })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">
                    Border radius (Bo tròn các thành phần)
                  </span>
                  <span className="text-muted-foreground">
                    {settings.borderRadius}px
                  </span>
                </div>
                <Slider
                  value={[settings.borderRadius]}
                  min={0}
                  max={24}
                  step={2}
                  onValueChange={(val) =>
                    updateSettings({ borderRadius: val[0] })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Font family (Kiểu chữ)
                </span>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(val) => updateSettings({ fontFamily: val })}
                >
                  <SelectTrigger className="w-35 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Playfair Display">
                      Playfair Display
                    </SelectItem>
                    <SelectItem value="Outfit">Outfit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Font weight (Độ đậm của chữ)
                </span>
                <Select
                  value={settings.fontWeight}
                  onValueChange={(val: any) =>
                    updateSettings({ fontWeight: val })
                  }
                >
                  <SelectTrigger className="w-30 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="semibold">Semibold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">
                    Font size (Kích thước chữ tiêu đề)
                  </span>
                  <span className="text-muted-foreground">
                    {settings.titleSize}px
                  </span>
                </div>
                <Slider
                  value={[settings.titleSize]}
                  min={14}
                  max={32}
                  onValueChange={(val) => updateSettings({ titleSize: val[0] })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">
                    Font size (Kích thước chữ thân)
                  </span>
                  <span className="text-muted-foreground">
                    {settings.bodySize}px
                  </span>
                </div>
                <Slider
                  value={[settings.bodySize]}
                  min={12}
                  max={20}
                  onValueChange={(val) => updateSettings({ bodySize: val[0] })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Kiểu chữ in đậm (Bold)
                </span>
                <Switch
                  size="sm"
                  checked={settings.boldText}
                  onCheckedChange={(val) => updateSettings({ boldText: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Kiểu chữ in nghiêng (Italic)
                </span>
                <Switch
                  size="sm"
                  checked={settings.italicText}
                  onCheckedChange={(val) => updateSettings({ italicText: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Kiểu chữ in hoa (Uppercase)
                </span>
                <Switch
                  size="sm"
                  checked={settings.uppercaseText}
                  onCheckedChange={(val) =>
                    updateSettings({ uppercaseText: val })
                  }
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold block">
                  Màu chính (Primary color)
                </span>
                <div className="grid grid-cols-5 gap-3">
                  {primaryColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        updateSettings({ primaryColor: color.value })
                      }
                      className={cn(
                        "size-8 rounded-md border border-black/10 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 shadow-xs flex items-center justify-center",
                        settings.primaryColor === color.value
                          ? "ring-2 ring-primary ring-offset-2 scale-105"
                          : "",
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {settings.primaryColor === color.value && (
                        <div className="size-2 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">
                    Màu nền thanh điều hướng (Navbar color)
                  </span>
                  <Select
                    value={settings.navbarColorType}
                    onValueChange={(val: any) =>
                      updateSettings({ navbarColorType: val })
                    }
                  >
                    <SelectTrigger className="w-27.5 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">MMàu đơn</SelectItem>
                      <SelectItem value="gradient">Màu gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(["light", "dark"] as const).map((mode) => {
                  const isLight = mode === "light";
                  const palette =
                    settings.navbarColorType === "solid"
                      ? isLight
                        ? solidColors
                        : solidColorsDark
                      : isLight
                        ? gradientColors
                        : gradientColorsDark;
                  const currentVal = isLight
                    ? settings.navbarColorLight
                    : settings.navbarColorDark;
                  const updateKey = isLight
                    ? "navbarColorLight"
                    : "navbarColorDark";
                  const label = isLight ? "Light" : "Dark";

                  return (
                    <div key={mode} className="space-y-1.5">
                      <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                        {label}
                      </span>
                      <div className="grid grid-cols-5 gap-3 mt-3">
                        {palette.map((color, index) => (
                          <button
                            key={color}
                            onClick={() =>
                              updateSettings({ [updateKey]: color } as any)
                            }
                            className={cn(
                              "size-8 rounded-md border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 shadow-xs flex items-center justify-center",
                              isLight ? "border-black/10" : "border-white/10",
                              currentVal === color
                                ? "ring-2 ring-primary ring-offset-2 scale-105"
                                : "",
                            )}
                            style={{
                              background: color,
                            }}
                            title={
                              settings.navbarColorType === "gradient"
                                ? `Gradient ${index + 1}`
                                : color
                            }
                          >
                            {currentVal === color && (
                              <div
                                className={cn(
                                  "size-2 rounded-full shadow-xs",
                                  isLight ? "bg-primary" : "bg-white",
                                )}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">Màu sidebar</span>
                  <Select
                    value={settings.sidebarColorType}
                    onValueChange={(val: any) =>
                      updateSettings({ sidebarColorType: val })
                    }
                  >
                    <SelectTrigger className="w-27.5 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Màu đơn</SelectItem>
                      <SelectItem value="gradient">Màu gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(["light", "dark"] as const).map((mode) => {
                  const isLight = mode === "light";
                  const palette =
                    settings.sidebarColorType === "solid"
                      ? isLight
                        ? solidColors
                        : solidColorsDark
                      : isLight
                        ? gradientColors
                        : gradientColorsDark;
                  const currentVal = isLight
                    ? settings.sidebarColorLight
                    : settings.sidebarColorDark;
                  const updateKey = isLight
                    ? "sidebarColorLight"
                    : "sidebarColorDark";
                  const label = isLight ? "Light" : "Dark";

                  return (
                    <div key={mode} className="space-y-1.5">
                      <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                        {label}
                      </span>
                      <div className="grid grid-cols-5 gap-3 mt-3">
                        {palette.map((color, index) => (
                          <button
                            key={color}
                            onClick={() =>
                              updateSettings({ [updateKey]: color } as any)
                            }
                            className={cn(
                              "size-8 rounded-md border transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 shadow-xs flex items-center justify-center",
                              isLight ? "border-black/10" : "border-white/10",
                              currentVal === color
                                ? "ring-2 ring-primary ring-offset-2 scale-105"
                                : "",
                            )}
                            style={{
                              background: color,
                            }}
                            title={
                              settings.sidebarColorType === "gradient"
                                ? `Gradient ${index + 1}`
                                : color
                            }
                          >
                            {currentVal === color && (
                              <div
                                className={cn(
                                  "size-2 rounded-full shadow-xs",
                                  isLight ? "bg-primary" : "bg-white",
                                )}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary">Bố cục</h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Chế độ bố cục</span>
                <Select
                  value={settings.layoutMode}
                  onValueChange={(val: any) =>
                    updateSettings({ layoutMode: val })
                  }
                >
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Vị trí sidebar</span>
                <Select
                  value={settings.sidebarPosition}
                  onValueChange={(val: any) =>
                    updateSettings({ sidebarPosition: val })
                  }
                >
                  <SelectTrigger className="w-30 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Trái</SelectItem>
                    <SelectItem value="right">Phải</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Vị trí cài đặt</span>
                <Select
                  value={settings.configPosition}
                  onValueChange={(val: any) =>
                    updateSettings({ configPosition: val })
                  }
                >
                  <SelectTrigger className="w-30 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Trái</SelectItem>
                    <SelectItem value="right">Phải</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary">Sidebar</h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Hiện sidebar</span>
                <Switch
                  size="sm"
                  checked={settings.showSidebar}
                  onCheckedChange={(val) =>
                    updateSettings({ showSidebar: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Thu gọn sidebar</span>
                <Switch
                  size="sm"
                  checked={settings.collapseSidebar}
                  onCheckedChange={(val) =>
                    updateSettings({ collapseSidebar: val })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Chiều rộng sidebar</span>
                  <span className="text-muted-foreground">
                    {settings.sidebarWidth}px
                  </span>
                </div>
                <Slider
                  value={[settings.sidebarWidth]}
                  min={200}
                  max={320}
                  onValueChange={(val) =>
                    updateSettings({ sidebarWidth: val[0] })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Chiều rộng khi thu gọn</span>
                  <span className="text-muted-foreground">
                    {settings.sidebarCollapsedWidth}px
                  </span>
                </div>
                <Slider
                  value={[settings.sidebarCollapsedWidth]}
                  min={60}
                  max={100}
                  onValueChange={(val) =>
                    updateSettings({ sidebarCollapsedWidth: val[0] })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Menu dạng accordion</span>
                <Switch
                  size="sm"
                  checked={settings.accordionMenu}
                  onCheckedChange={(val) =>
                    updateSettings({ accordionMenu: val })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary">Tabs</h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Hiện tabs</span>
                <Switch
                  size="sm"
                  checked={settings.showTabs}
                  onCheckedChange={(val) => updateSettings({ showTabs: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Lưu tabs</span>
                <Switch
                  size="sm"
                  checked={settings.persistTabs}
                  onCheckedChange={(val) =>
                    updateSettings({ persistTabs: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Kéo thả tabs</span>
                <Switch
                  size="sm"
                  checked={settings.dragTabs}
                  onCheckedChange={(val) => updateSettings({ dragTabs: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Hiện icon tabs</span>
                <Switch
                  size="sm"
                  checked={settings.showTabIcons}
                  onCheckedChange={(val) =>
                    updateSettings({ showTabIcons: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Hiện nút phóng to</span>
                <Switch
                  size="sm"
                  checked={settings.showMaximizeTab}
                  onCheckedChange={(val) =>
                    updateSettings({ showMaximizeTab: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Kiểu tab</span>
                <Select
                  value={settings.tabStyle}
                  onValueChange={(val: any) =>
                    updateSettings({ tabStyle: val })
                  }
                >
                  <SelectTrigger className="w-30 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chrome">Chrome</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="icon">Icon</SelectItem>
                    <SelectItem value="simple">Đơn giản</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Số tab tối đa</span>
                  <span className="text-muted-foreground">
                    {settings.maxTabs}
                  </span>
                </div>
                <Slider
                  value={[settings.maxTabs]}
                  min={3}
                  max={20}
                  onValueChange={(val) => updateSettings({ maxTabs: val[0] })}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary">Hiệu ứng</h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Thanh tiến trình</span>
                <Switch
                  size="sm"
                  checked={settings.pageProgress}
                  onCheckedChange={(val) =>
                    updateSettings({ pageProgress: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Loader trang</span>
                <Switch
                  size="sm"
                  checked={settings.pageLoader}
                  onCheckedChange={(val) => updateSettings({ pageLoader: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Chuyển trang</span>
                <Switch
                  size="sm"
                  checked={settings.pageTransition}
                  onCheckedChange={(val) =>
                    updateSettings({ pageTransition: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Hiệu ứng chuyển</span>
                <Select
                  value={settings.transitionEffect}
                  onValueChange={(val) =>
                    updateSettings({ transitionEffect: val })
                  }
                >
                  <SelectTrigger className="w-35 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transitionEffects.map((effect) => (
                      <SelectItem key={effect} value={effect}>
                        {effect}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary">Footer</h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Hiện footer</span>
                <Switch
                  size="sm"
                  checked={settings.showFooter}
                  onCheckedChange={(val) => updateSettings({ showFooter: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Footer cố định</span>
                <Switch
                  size="sm"
                  checked={settings.fixedFooter}
                  onCheckedChange={(val) =>
                    updateSettings({ fixedFooter: val })
                  }
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">
                  Tên công ty
                </span>
                <Input
                  className="h-8 text-xs"
                  value={settings.companyName}
                  onChange={(e) =>
                    updateSettings({ companyName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">
                  Website công ty
                </span>
                <Input
                  className="h-8 text-xs"
                  value={settings.companyWebsite}
                  onChange={(e) =>
                    updateSettings({ companyWebsite: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">
                  Năm bản quyền
                </span>
                <Input
                  className="h-8 text-xs"
                  value={settings.copyrightYear}
                  onChange={(e) =>
                    updateSettings({ copyrightYear: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">
                  Số ICP
                </span>
                <Input
                  className="h-8 text-xs"
                  value={settings.icpNumber}
                  onChange={(e) =>
                    updateSettings({ icpNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">
                  Liên kết ICP
                </span>
                <Input
                  className="h-8 text-xs"
                  value={settings.icpLink}
                  onChange={(e) => updateSettings({ icpLink: e.target.value })}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-muted/20 space-y-2 mt-auto shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetSettings}
              className="w-full flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              Khôi phục mặc định
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyConfig}
              className="w-full flex items-center justify-center gap-1.5"
            >
              <Copy className="size-3.5" />
              Sao chép cấu hình
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5"
          >
            <LogOut className="size-3.5" />
            Xoá cache & đăng xuất
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ConfigSetting;

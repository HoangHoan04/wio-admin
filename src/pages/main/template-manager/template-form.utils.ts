export type EnvelopeStyle = "classic" | "minimal" | "none";
export type HeroStyle = "single" | "split" | "carousel";

export type SectionId =
  | "hero"
  | "divider"
  | "familyInfo"
  | "hosts"
  | "intro"
  | "ceremonies"
  | "countdown"
  | "gallery"
  | "partyInfo"
  | "timeline"
  | "rsvp"
  | "map"
  | "guestbook"
  | "giftBox"
  | "dressCode"
  | "thankYou";

export interface ThemeLayoutValue {
  envelopeStyle: EnvelopeStyle;
  heroStyle: HeroStyle;
  sectionOrder: SectionId[];
}

export interface PresetTokensValue {
  code: string;
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    envelope: string;
    buttonBg: string;
    buttonText: string;
  };
  fonts: {
    heading: string;
    body: string;
    script?: string;
  };
}

export interface CanvasPresetValue {
  schemaVersion: number;
  canvasBackground: string;
  backgroundOpacity: number;
  canvasHeight: number;
  backgroundImageUrl?: string;
  elements: unknown[];
  effects: Record<string, unknown>;
}

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Ảnh đại diện",
  divider: "Trang trí",
  familyInfo: "Thông tin gia đình",
  hosts: "Chủ thể",
  intro: "Lời mời",
  ceremonies: "Lễ / Sự kiện",
  countdown: "Đếm ngược",
  gallery: "Album ảnh",
  partyInfo: "Thông tin tiệc",
  timeline: "Lịch trình",
  rsvp: "Xác nhận tham dự",
  map: "Bản đồ",
  guestbook: "Sổ lời chúc",
  giftBox: "Mừng cưới / Quà",
  dressCode: "Dress code",
  thankYou: "Lời cảm ơn",
};

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "hero",
  "divider",
  "familyInfo",
  "hosts",
  "intro",
  "ceremonies",
  "countdown",
  "gallery",
  "partyInfo",
  "timeline",
  "rsvp",
  "map",
  "guestbook",
  "giftBox",
  "dressCode",
  "thankYou",
];

export const ENVELOPE_STYLE_OPTIONS: { value: EnvelopeStyle; label: string }[] =
  [
    { value: "classic", label: "Cổ điển" },
    { value: "minimal", label: "Tối giản" },
    { value: "none", label: "Không dùng phong bì" },
  ];

export const HERO_STYLE_OPTIONS: { value: HeroStyle; label: string }[] = [
  { value: "single", label: "1 ảnh" },
  { value: "split", label: "2 cột cô dâu / chú rể" },
  { value: "carousel", label: "Carousel" },
];

export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Great Vibes", value: "'Great Vibes', cursive" },
  { label: "Cinzel", value: "'Cinzel', serif" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
];

export const COLOR_FIELDS: {
  key: keyof PresetTokensValue["colors"];
  label: string;
}[] = [
  { key: "background", label: "Nền trang" },
  { key: "textPrimary", label: "Chữ chính" },
  { key: "textSecondary", label: "Chữ phụ" },
  { key: "accent", label: "Màu nhấn" },
  { key: "envelope", label: "Phong bì" },
  { key: "buttonBg", label: "Nền nút" },
  { key: "buttonText", label: "Chữ nút" },
];

const FALLBACK_TOKENS: PresetTokensValue["colors"] = {
  background: "#fbf8f3",
  textPrimary: "#4a3525",
  textSecondary: "#73533b",
  accent: "#b87333",
  envelope: "#63452f",
  buttonBg: "#63452f",
  buttonText: "#fbf8f3",
};

const FALLBACK_FONTS: PresetTokensValue["fonts"] = {
  heading: "'Playfair Display', serif",
  body: "'Cormorant Garamond', serif",
  script: "'Great Vibes', cursive",
};

type ThemeCatalogEntry = {
  heroStyle: HeroStyle;
  envelopeStyle: EnvelopeStyle;
  colors: PresetTokensValue["colors"];
  fonts: PresetTokensValue["fonts"];
};

const THEME_CATALOG: Record<string, ThemeCatalogEntry> = {
  BOHO_FLORAL_BROWN: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#fbf8f3",
      textPrimary: "#4a3525",
      textSecondary: "#73533b",
      accent: "#b87333",
      envelope: "#63452f",
      buttonBg: "#63452f",
      buttonText: "#fbf8f3",
    },
    fonts: FALLBACK_FONTS,
  },
  BOHO_FLORAL_GREEN: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#f4f8f5",
      textPrimary: "#1e3a2b",
      textSecondary: "#3b5e47",
      accent: "#4a8b64",
      envelope: "#264e36",
      buttonBg: "#2d5a40",
      buttonText: "#f4f8f5",
    },
    fonts: FALLBACK_FONTS,
  },
  BOHO_FLORAL_PINK: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#fff9fb",
      textPrimary: "#6b3a4a",
      textSecondary: "#8f5668",
      accent: "#d66b8a",
      envelope: "#b84d6d",
      buttonBg: "#b84d6d",
      buttonText: "#fff9fb",
    },
    fonts: FALLBACK_FONTS,
  },
  DRAGON_PHOENIX_RED: {
    heroStyle: "single",
    envelopeStyle: "classic",
    colors: {
      background: "#fff5f5",
      textPrimary: "#7f1d1d",
      textSecondary: "#991b1b",
      accent: "#d97706",
      envelope: "#881337",
      buttonBg: "#b91c1c",
      buttonText: "#fff5f5",
    },
    fonts: FALLBACK_FONTS,
  },
  RED_DOUBLE_HAPPINESS: {
    heroStyle: "single",
    envelopeStyle: "classic",
    colors: {
      background: "#fff8f6",
      textPrimary: "#8b0000",
      textSecondary: "#a30000",
      accent: "#f59e0b",
      envelope: "#991b1b",
      buttonBg: "#991b1b",
      buttonText: "#fff8f6",
    },
    fonts: FALLBACK_FONTS,
  },
  ROYAL_RED: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#220505",
      textPrimary: "#fde8d0",
      textSecondary: "#f0c896",
      accent: "#d4af37",
      envelope: "#4a0909",
      buttonBg: "#8b1a1a",
      buttonText: "#fde8d0",
    },
    fonts: {
      heading: "'Cinzel', serif",
      body: "'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
  BURGUNDY_ROMANCE: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#fff7f8",
      textPrimary: "#5b132b",
      textSecondary: "#862d48",
      accent: "#c05675",
      envelope: "#6b1426",
      buttonBg: "#6b1426",
      buttonText: "#fff7f8",
    },
    fonts: FALLBACK_FONTS,
  },
  OLIVE_MEDITERRANEAN: {
    heroStyle: "single",
    envelopeStyle: "classic",
    colors: {
      background: "#faf9f5",
      textPrimary: "#2d3b1e",
      textSecondary: "#4a5e33",
      accent: "#b89230",
      envelope: "#3b4d27",
      buttonBg: "#3b4d27",
      buttonText: "#faf9f5",
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Outfit', sans-serif",
      script: "'Great Vibes', cursive",
    },
  },
  PURE_WHITE_ELEGANCE: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#fdfdfd",
      textPrimary: "#1e293b",
      textSecondary: "#475569",
      accent: "#94a3b8",
      envelope: "#334155",
      buttonBg: "#1e293b",
      buttonText: "#fdfdfd",
    },
    fonts: {
      heading: "'Cinzel', serif",
      body: "'Montserrat', sans-serif",
      script: "'Great Vibes', cursive",
    },
  },
  VINTAGE_NOSTALGIA: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#fdfaf3",
      textPrimary: "#3e271a",
      textSecondary: "#6d4c38",
      accent: "#b45309",
      envelope: "#523624",
      buttonBg: "#523624",
      buttonText: "#fdfaf3",
    },
    fonts: FALLBACK_FONTS,
  },
  CLASSIC: {
    heroStyle: "single",
    envelopeStyle: "classic",
    colors: FALLBACK_TOKENS,
    fonts: FALLBACK_FONTS,
  },
  MODERN: {
    heroStyle: "split",
    envelopeStyle: "minimal",
    colors: {
      background: "#f8fafc",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      accent: "#0ea5e9",
      envelope: "#1e293b",
      buttonBg: "#0f172a",
      buttonText: "#f8fafc",
    },
    fonts: {
      heading: "'Outfit', sans-serif",
      body: "'Montserrat', sans-serif",
      script: "'Great Vibes', cursive",
    },
  },
  MINIMAL: {
    heroStyle: "single",
    envelopeStyle: "none",
    colors: {
      background: "#ffffff",
      textPrimary: "#171717",
      textSecondary: "#525252",
      accent: "#737373",
      envelope: "#262626",
      buttonBg: "#171717",
      buttonText: "#ffffff",
    },
    fonts: {
      heading: "'Montserrat', sans-serif",
      body: "'Montserrat', sans-serif",
      script: "'Great Vibes', cursive",
    },
  },
  LUXURY: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#faf6ee",
      textPrimary: "#3f2e1e",
      textSecondary: "#7a6248",
      accent: "#c9a227",
      envelope: "#3f2e1e",
      buttonBg: "#3f2e1e",
      buttonText: "#faf6ee",
    },
    fonts: {
      heading: "'Cinzel', serif",
      body: "'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
  VINTAGE: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#fdfaf3",
      textPrimary: "#3e271a",
      textSecondary: "#6d4c38",
      accent: "#b45309",
      envelope: "#523624",
      buttonBg: "#523624",
      buttonText: "#fdfaf3",
    },
    fonts: FALLBACK_FONTS,
  },
  FLORAL: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: {
      background: "#fff9fb",
      textPrimary: "#6b3a4a",
      textSecondary: "#8f5668",
      accent: "#d66b8a",
      envelope: "#b84d6d",
      buttonBg: "#b84d6d",
      buttonText: "#fff9fb",
    },
    fonts: FALLBACK_FONTS,
  },
  TRADITIONAL: {
    heroStyle: "single",
    envelopeStyle: "classic",
    colors: {
      background: "#fff8f6",
      textPrimary: "#8b0000",
      textSecondary: "#a30000",
      accent: "#f59e0b",
      envelope: "#991b1b",
      buttonBg: "#991b1b",
      buttonText: "#fff8f6",
    },
    fonts: FALLBACK_FONTS,
  },
  BEACH: {
    heroStyle: "split",
    envelopeStyle: "minimal",
    colors: {
      background: "#f0fafa",
      textPrimary: "#164e63",
      textSecondary: "#0e7490",
      accent: "#06b6d4",
      envelope: "#155e75",
      buttonBg: "#0e7490",
      buttonText: "#f0fafa",
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Outfit', sans-serif",
      script: "'Great Vibes', cursive",
    },
  },
  RUSTIC: {
    heroStyle: "split",
    envelopeStyle: "classic",
    colors: FALLBACK_TOKENS,
    fonts: FALLBACK_FONTS,
  },
};

const THEME_CODE_ALIASES: Record<string, string> = {
  AUTUMN_BLOOM: "BOHO_FLORAL_BROWN",
  SPRING_BLOOM: "BOHO_FLORAL_GREEN",
  ROSY_BLOOM: "BOHO_FLORAL_PINK",
  DRAGON_BLESSING: "DRAGON_PHOENIX_RED",
  SCARLET_UNION: "RED_DOUBLE_HAPPINESS",
  REGAL_CRIMSON: "ROYAL_RED",
  PHOENIX_PAIR: "DRAGON_PHOENIX_RED",
  TWIN_PHOENIX: "DRAGON_PHOENIX_RED",
  GOLDEN_PHOENIX: "DRAGON_PHOENIX_RED",
  REGAL_UNION: "RED_DOUBLE_HAPPINESS",
  EMERALD_STORY: "BOHO_FLORAL_GREEN",
  EMERALD_UNION: "BOHO_FLORAL_GREEN",
  BLUSH_GARDEN: "BOHO_FLORAL_PINK",
  IVORY_BLOSSOM: "PURE_WHITE_ELEGANCE",
  VINTAGE_MINIMAL: "VINTAGE_NOSTALGIA",
  RUBY_ENVELOPE: "BURGUNDY_ROMANCE",
  CRIMSON_BAROQUE: "ROYAL_RED",
};

function catalogOf(themeCode?: string): ThemeCatalogEntry {
  const resolved = themeCode
    ? THEME_CODE_ALIASES[themeCode] || themeCode
    : undefined;
  if (resolved && THEME_CATALOG[resolved]) return THEME_CATALOG[resolved];
  if (themeCode && THEME_CATALOG[themeCode]) return THEME_CATALOG[themeCode];
  return THEME_CATALOG.CLASSIC;
}

export function getDefaultLayout(themeCode?: string): ThemeLayoutValue {
  const entry = catalogOf(themeCode);
  return {
    envelopeStyle: entry.envelopeStyle,
    heroStyle: entry.heroStyle,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
  };
}

export function getDefaultTokens(themeCode?: string): PresetTokensValue {
  const entry = catalogOf(themeCode);
  return {
    code: themeCode || "CLASSIC",
    colors: { ...entry.colors },
    fonts: { ...entry.fonts },
  };
}

export function getDefaultCanvasPreset(): CanvasPresetValue {
  return {
    schemaVersion: 1,
    canvasBackground: "#FDFBF7",
    backgroundOpacity: 1,
    canvasHeight: 956,
    elements: [],
    effects: {},
  };
}

export function isEmptyLayout(value: unknown): boolean {
  if (!value || typeof value !== "object") return true;
  const layout = value as Partial<ThemeLayoutValue>;
  return !Array.isArray(layout.sectionOrder) || layout.sectionOrder.length === 0;
}

export function isEmptyTokens(value: unknown): boolean {
  if (!value || typeof value !== "object") return true;
  const tokens = value as Partial<PresetTokensValue>;
  return !tokens.colors || Object.keys(tokens.colors).length === 0;
}

export function normalizeLayout(value: unknown, themeCode?: string): ThemeLayoutValue {
  const fallback = getDefaultLayout(themeCode);
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Record<string, any>;
  const envelopeStyle = ENVELOPE_STYLE_OPTIONS.some(
    (item) => item.value === raw.envelopeStyle,
  )
    ? (raw.envelopeStyle as EnvelopeStyle)
    : fallback.envelopeStyle;
  const heroStyle = HERO_STYLE_OPTIONS.some((item) => item.value === raw.heroStyle)
    ? (raw.heroStyle as HeroStyle)
    : fallback.heroStyle;
  const incoming = Array.isArray(raw.sectionOrder)
    ? (raw.sectionOrder.filter((id: string) =>
        DEFAULT_SECTION_ORDER.includes(id as SectionId),
      ) as SectionId[])
    : [];
  return {
    envelopeStyle,
    heroStyle,
    sectionOrder: incoming.length ? incoming : fallback.sectionOrder,
  };
}

export function normalizeTokens(
  value: unknown,
  themeCode?: string,
): PresetTokensValue {
  const fallback = getDefaultTokens(themeCode);
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Record<string, any>;
  const colors = raw.colors && typeof raw.colors === "object" ? raw.colors : {};
  const fonts = raw.fonts && typeof raw.fonts === "object" ? raw.fonts : {};
  return {
    code: raw.code || themeCode || fallback.code,
    colors: {
      background: colors.background || fallback.colors.background,
      textPrimary: colors.textPrimary || fallback.colors.textPrimary,
      textSecondary: colors.textSecondary || fallback.colors.textSecondary,
      accent: colors.accent || fallback.colors.accent,
      envelope: colors.envelope || fallback.colors.envelope,
      buttonBg: colors.buttonBg || fallback.colors.buttonBg,
      buttonText: colors.buttonText || fallback.colors.buttonText,
    },
    fonts: {
      heading: fonts.heading || fallback.fonts.heading,
      body: fonts.body || fallback.fonts.body,
      script: fonts.script || fallback.fonts.script,
    },
  };
}

export function normalizeCanvasPreset(value: unknown): CanvasPresetValue {
  const fallback = getDefaultCanvasPreset();
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Record<string, any>;
  const opacityRaw = Number(raw.backgroundOpacity);
  const opacity =
    Number.isFinite(opacityRaw) && opacityRaw > 1
      ? Math.min(1, opacityRaw / 100)
      : Number.isFinite(opacityRaw)
        ? Math.min(1, Math.max(0, opacityRaw))
        : fallback.backgroundOpacity;
  return {
    schemaVersion: 1,
    canvasBackground: raw.canvasBackground || fallback.canvasBackground,
    backgroundOpacity: opacity,
    canvasHeight: Number(raw.canvasHeight) || fallback.canvasHeight,
    backgroundImageUrl: raw.backgroundImageUrl || undefined,
    elements: Array.isArray(raw.elements) ? raw.elements : [],
    effects:
      raw.effects && typeof raw.effects === "object" ? raw.effects : {},
  };
}

export function fontLabel(value?: string): string {
  if (!value) return "—";
  const found = FONT_OPTIONS.find((item) => item.value === value);
  if (found) return found.label;
  return value.replace(/['"]/g, "").split(",")[0]?.trim() || value;
}

export function envelopeLabel(value?: string): string {
  return (
    ENVELOPE_STYLE_OPTIONS.find((item) => item.value === value)?.label ||
    value ||
    "—"
  );
}

export function heroLabel(value?: string): string {
  return (
    HERO_STYLE_OPTIONS.find((item) => item.value === value)?.label ||
    value ||
    "—"
  );
}

export function toColorInput(value?: string): string {
  if (!value) return "#000000";
  const hex = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#000000";
}

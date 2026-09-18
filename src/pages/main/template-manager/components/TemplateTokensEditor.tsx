import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import {
  COLOR_FIELDS,
  FONT_OPTIONS,
  getDefaultTokens,
  normalizeTokens,
  toColorInput,
  type PresetTokensValue,
} from "../template-form.utils";

interface TemplateTokensEditorProps {
  value: PresetTokensValue | undefined;
  themeCode?: string;
  onChange: (value: PresetTokensValue) => void;
}

export default function TemplateTokensEditor({
  value,
  themeCode,
  onChange,
}: TemplateTokensEditorProps) {
  const tokens = normalizeTokens(value, themeCode);

  const patchColors = (key: keyof PresetTokensValue["colors"], next: string) => {
    onChange({
      ...tokens,
      code: themeCode || tokens.code,
      colors: { ...tokens.colors, [key]: next },
    });
  };

  const patchFonts = (key: keyof PresetTokensValue["fonts"], next: string) => {
    onChange({
      ...tokens,
      code: themeCode || tokens.code,
      fonts: { ...tokens.fonts, [key]: next },
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Màu sắc &amp; font</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(getDefaultTokens(themeCode))}
        >
          <RotateCcw className="size-3.5" />
          Áp dụng mặc định theo mã theme
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div
          className="rounded-lg border p-4"
          style={{ background: tokens.colors.background }}
        >
          <p
            className="text-xl"
            style={{
              color: tokens.colors.textPrimary,
              fontFamily: tokens.fonts.heading,
            }}
          >
            Tên cô dâu &amp; chú rể
          </p>
          <p
            className="text-sm"
            style={{
              color: tokens.colors.textSecondary,
              fontFamily: tokens.fonts.body,
            }}
          >
            Trân trọng kính mời bạn đến dự lễ cưới
          </p>
          <span
            className="mt-3 inline-flex rounded-md px-3 py-1 text-xs"
            style={{
              background: tokens.colors.buttonBg,
              color: tokens.colors.buttonText,
            }}
          >
            Xác nhận tham dự
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLOR_FIELDS.map((field) => (
            <label key={field.key} className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted-foreground">{field.label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="size-9 cursor-pointer rounded-md border bg-transparent p-0.5"
                  value={toColorInput(tokens.colors[field.key])}
                  onChange={(e) => patchColors(field.key, e.target.value)}
                />
                <Input
                  value={tokens.colors[field.key]}
                  onChange={(e) => patchColors(field.key, e.target.value)}
                  maxLength={20}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FontSelect
            label="Font tiêu đề"
            value={tokens.fonts.heading}
            onChange={(val) => patchFonts("heading", val)}
          />
          <FontSelect
            label="Font nội dung"
            value={tokens.fonts.body}
            onChange={(val) => patchFonts("body", val)}
          />
          <FontSelect
            label="Font chữ ký"
            value={tokens.fonts.script || ""}
            onChange={(val) => patchFonts("script", val)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const options = FONT_OPTIONS.some((item) => item.value === value)
    ? FONT_OPTIONS
    : value
      ? [{ label: value, value }, ...FONT_OPTIONS]
      : FONT_OPTIONS;

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontFamily: value }}
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

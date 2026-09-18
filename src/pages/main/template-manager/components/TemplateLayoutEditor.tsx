import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import {
  DEFAULT_SECTION_ORDER,
  ENVELOPE_STYLE_OPTIONS,
  HERO_STYLE_OPTIONS,
  SECTION_LABELS,
  getDefaultLayout,
  normalizeLayout,
  type EnvelopeStyle,
  type HeroStyle,
  type SectionId,
  type ThemeLayoutValue,
} from "../template-form.utils";

interface TemplateLayoutEditorProps {
  value: ThemeLayoutValue | undefined;
  themeCode?: string;
  onChange: (value: ThemeLayoutValue) => void;
}

export default function TemplateLayoutEditor({
  value,
  themeCode,
  onChange,
}: TemplateLayoutEditorProps) {
  const layout = normalizeLayout(value, themeCode);
  const orderedIds = mergeSectionOrder(layout.sectionOrder);
  const enabled = new Set(layout.sectionOrder);

  const patch = (partial: Partial<ThemeLayoutValue>) => {
    onChange({ ...layout, ...partial });
  };

  const move = (id: SectionId, direction: -1 | 1) => {
    const index = orderedIds.indexOf(id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= orderedIds.length) return;
    const next = [...orderedIds];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    patch({
      sectionOrder: next.filter((sectionId) => enabled.has(sectionId)),
    });
  };

  const toggle = (id: SectionId, checked: boolean) => {
    const nextEnabled = new Set(enabled);
    if (checked) nextEnabled.add(id);
    else nextEnabled.delete(id);
    patch({
      sectionOrder: orderedIds.filter((sectionId) => nextEnabled.has(sectionId)),
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Bố cục thiệp</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(getDefaultLayout(themeCode))}
        >
          <RotateCcw className="size-3.5" />
          Áp dụng mặc định theo mã theme
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Kiểu phong bì</legend>
            <RadioGroup
              value={layout.envelopeStyle}
              onValueChange={(val) =>
                patch({ envelopeStyle: val as EnvelopeStyle })
              }
              className="gap-2"
            >
              {ENVELOPE_STYLE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Ảnh bìa</legend>
            <RadioGroup
              value={layout.heroStyle}
              onValueChange={(val) => patch({ heroStyle: val as HeroStyle })}
              className="gap-2"
            >
              {HERO_STYLE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Thứ tự các mục trên thiệp</p>
          <p className="text-xs text-muted-foreground">
            Bỏ tick để ẩn mục. Dùng mũi tên để đổi thứ tự hiển thị.
          </p>
          <div className="flex flex-col gap-1 rounded-md border p-2">
            {orderedIds.map((id, index) => (
              <div
                key={id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
              >
                <Checkbox
                  checked={enabled.has(id)}
                  onCheckedChange={(checked) => toggle(id, checked === true)}
                />
                <span className="flex-1 text-sm">{SECTION_LABELS[id]}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={index === 0}
                  onClick={() => move(id, -1)}
                >
                  <ChevronUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={index === orderedIds.length - 1}
                  onClick={() => move(id, 1)}
                >
                  <ChevronDown className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function mergeSectionOrder(enabledOrder: SectionId[]): SectionId[] {
  const seen = new Set<SectionId>();
  const merged: SectionId[] = [];
  for (const id of [...enabledOrder, ...DEFAULT_SECTION_ORDER]) {
    if (seen.has(id)) continue;
    seen.add(id);
    merged.push(id);
  }
  return merged;
}

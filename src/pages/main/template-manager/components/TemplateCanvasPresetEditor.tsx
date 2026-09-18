import FileUploadCustom from "@/components/layout/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  getDefaultCanvasPreset,
  normalizeCanvasPreset,
  toColorInput,
  type CanvasPresetValue,
} from "../template-form.utils";

interface TemplateCanvasPresetEditorProps {
  value: CanvasPresetValue | undefined;
  onChange: (value: CanvasPresetValue) => void;
}

export default function TemplateCanvasPresetEditor({
  value,
  onChange,
}: TemplateCanvasPresetEditorProps) {
  const preset = normalizeCanvasPreset(value);
  const opacityPct = Math.round((preset.backgroundOpacity ?? 1) * 100);

  const patch = (partial: Partial<CanvasPresetValue>) => {
    onChange({
      ...getDefaultCanvasPreset(),
      ...preset,
      ...partial,
      schemaVersion: 1,
      elements: preset.elements || [],
      effects: preset.effects || {},
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preset Canva</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground">
          Đây là canvas khởi tạo khi khách hàng chọn mẫu Canva. Không cần vẽ
          từng lớp — khách sẽ thiết kế tiếp trên editor.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">Màu nền canvas</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="size-9 cursor-pointer rounded-md border bg-transparent p-0.5"
                value={toColorInput(preset.canvasBackground)}
                onChange={(e) => patch({ canvasBackground: e.target.value })}
              />
              <Input
                value={preset.canvasBackground}
                onChange={(e) => patch({ canvasBackground: e.target.value })}
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">
              Độ mờ nền ({opacityPct}%)
            </span>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[opacityPct]}
              onValueChange={(vals) =>
                patch({ backgroundOpacity: (vals[0] ?? 100) / 100 })
              }
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">Chiều cao canvas (px)</span>
            <Input
              type="number"
              min={640}
              max={2000}
              value={preset.canvasHeight}
              onChange={(e) =>
                patch({
                  canvasHeight:
                    e.target.value === "" ? 956 : Number(e.target.value),
                })
              }
            />
          </label>
        </div>
        <FileUploadCustom
          label="Ảnh nền (tuỳ chọn)"
          type="image"
          mode="single"
          initValue={preset.backgroundImageUrl}
          onFileUploaded={(uploaded) => {
            const url =
              uploaded && !Array.isArray(uploaded) ? uploaded.fileUrl : "";
            patch({ backgroundImageUrl: url || undefined });
          }}
        />
      </CardContent>
    </Card>
  );
}

import { enumData } from "@/common/enums";
import { formatDateTime, getEnumName } from "@/common/helpers";
import ActionLog from "@/components/layout/ActionLog";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import { useTemplateDetail } from "@/hooks/template";
import {
  ArrowLeft,
  CheckCircle,
  History,
  Info,
  Layout,
  Palette,
  Star,
  Tag,
  Wrench,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  COLOR_FIELDS,
  SECTION_LABELS,
  envelopeLabel,
  fontLabel,
  heroLabel,
  normalizeCanvasPreset,
  normalizeLayout,
  normalizeTokens,
  type SectionId,
} from "../template-form.utils";

export default function DetailTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useTemplateDetail(id);

  if (isLoading) {
    return (
      <BaseView>
        <div className="flex h-full items-center justify-center p-12">
          <Spinner className="size-10 text-primary" />
        </div>
      </BaseView>
    );
  }

  if (!data) {
    return (
      <BaseView>
        <div className="flex h-full flex-col items-center justify-center gap-4 p-12">
          <p className="font-medium text-muted-foreground">
            Không tìm thấy thông tin template
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            Quay lại
          </Button>
        </div>
      </BaseView>
    );
  }

  const features: string[] = Array.isArray(data.features)
    ? data.features
    : typeof data.features === "string"
      ? ((data.features as unknown as string)
          .split(/\r?\n/)
          .map((s: string) => s.trim())
          .filter(Boolean))
      : Array.isArray((data.features as any)?.list)
        ? (data.features as any).list
        : data.features && typeof data.features === "object"
          ? Object.entries(data.features)
              .filter(([, value]) => value === true)
              .map(([key]) => key)
          : [];

  const categories = (data.categories || []).map((item) =>
    typeof item === "string" ? item : item.category,
  );
  const layout = normalizeLayout(data.themeLayout, data.themeCode);
  const tokens = normalizeTokens(data.presetTokens, data.themeCode);
  const canvas = normalizeCanvasPreset(data.canvasPreset);

  const tabs = [
    {
      key: "info",
      title: "Thông tin chi tiết",
      icon: <Info className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="size-4" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Tên template" value={data.name || "N/A"} />
                <InfoItem label="Slug" value={data.slug || "N/A"} />
                <InfoItem
                  label="Phong cách cưới"
                  value={getEnumName(enumData.WEDDING_THEME, data.weddingTheme)}
                />
                <InfoItem
                  label="Mã theme"
                  value={getEnumName(enumData.THEME_CODE, data.themeCode) || data.themeCode}
                />
                <InfoItem
                  label="Loại mẫu"
                  value={getEnumName(enumData.TEMPLATE_KIND, data.kind || "") || data.kind || "N/A"}
                />
                <InfoItem
                  label="Version"
                  value={data.version != null ? String(data.version) : "N/A"}
                />
                <InfoItem
                  label="Tông màu"
                  value={data.colorMood || "N/A"}
                />
                <InfoItem
                  label="Mô tả"
                  value={data.description || "N/A"}
                  className="md:col-span-2"
                />
                <InfoItem
                  label="Gói tối thiểu"
                  value={
                    data.minPlan?.name ||
                    data.minPlanId ||
                    "N/A"
                  }
                />
                <InfoItem
                  label="Số ngày dùng thử"
                  value={
                    data.trialDays != null ? `${data.trialDays} ngày` : "N/A"
                  }
                />
                <InfoItem
                  label="Thứ tự hiển thị"
                  value={data.sortOrder != null ? String(data.sortOrder) : "N/A"}
                />
                <InfoItem
                  label="Lượt xem"
                  value={data.viewCount != null ? String(data.viewCount) : "0"}
                />
                <InfoItem
                  label="Lượt dùng"
                  value={data.usedCount != null ? String(data.usedCount) : "0"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="size-4" />
                Trạng thái hoạt động & Cấu hình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem
                  label="Hiển thị"
                  value={
                    <StatusTag
                      severity={data.isShow ? "success" : "secondary"}
                      value={data.isShow ? "Đang hiển thị" : "Đang ẩn"}
                    />
                  }
                />
                <InfoItem
                  label="Premium"
                  value={
                    <StatusTag
                      severity={data.isPremium ? "warning" : "info"}
                      value={data.isPremium ? "Trả phí (Premium)" : "Miễn phí"}
                    />
                  }
                />
                <InfoItem
                  label="Ngày tạo"
                  value={data.createdAt ? formatDateTime(data.createdAt) : "N/A"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="size-4" />
                Thẻ phong cách (Tags)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.tags && data.tags.length > 0 ? (
                  data.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-[#c9a98a]"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Không có thẻ phong cách nào
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="size-4" />
                Danh mục phong cách
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-[#c9a98a]"
                    >
                      {getEnumName(enumData.WEDDING_THEME, category) || category}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Chưa gán danh mục
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {(data.thumbnailUrl || data.previewUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="size-4" />
                  Ảnh mẫu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {data.thumbnailUrl && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground">Thumbnail</span>
                      <img
                        src={data.thumbnailUrl}
                        alt={data.name}
                        className="h-40 w-full rounded-md object-cover border"
                      />
                    </div>
                  )}
                  {data.previewUrl && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground">Xem trước</span>
                      <img
                        src={data.previewUrl}
                        alt={`${data.name} preview`}
                        className="h-40 w-full rounded-md object-cover border"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {(data.themeLayout || data.presetTokens || data.canvasPreset) && (
            <>
              {data.themeLayout && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="size-4" />
                      Bố cục thiệp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                      <InfoItem
                        label="Kiểu phong bì"
                        value={envelopeLabel(layout.envelopeStyle)}
                      />
                      <InfoItem
                        label="Ảnh bìa"
                        value={heroLabel(layout.heroStyle)}
                      />
                      <div className="md:col-span-3 flex flex-col gap-2">
                        <span className="text-sm text-muted-foreground">
                          Thứ tự các mục
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {layout.sectionOrder.length > 0 ? (
                            layout.sectionOrder.map((id, index) => (
                              <span
                                key={id}
                                className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium"
                              >
                                {index + 1}. {SECTION_LABELS[id as SectionId] || id}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Chưa cấu hình
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {data.presetTokens && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="size-4" />
                      Màu sắc &amp; font
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div
                      className="rounded-lg border p-4"
                      style={{ background: tokens.colors.background }}
                    >
                      <p
                        className="text-lg font-medium"
                        style={{
                          color: tokens.colors.textPrimary,
                          fontFamily: tokens.fonts.heading,
                        }}
                      >
                        {fontLabel(tokens.fonts.heading)}
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          color: tokens.colors.textSecondary,
                          fontFamily: tokens.fonts.body,
                        }}
                      >
                        {fontLabel(tokens.fonts.body)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {COLOR_FIELDS.map((field) => (
                        <div key={field.key} className="flex items-center gap-2">
                          <span
                            className="size-6 rounded-md border"
                            style={{ background: tokens.colors[field.key] }}
                          />
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              {field.label}
                            </span>
                            <span className="text-xs font-medium">
                              {tokens.colors[field.key]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <InfoItem
                        label="Font tiêu đề"
                        value={fontLabel(tokens.fonts.heading)}
                      />
                      <InfoItem
                        label="Font nội dung"
                        value={fontLabel(tokens.fonts.body)}
                      />
                      <InfoItem
                        label="Font chữ ký"
                        value={fontLabel(tokens.fonts.script)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {data.canvasPreset && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="size-4" />
                      Preset Canva
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                      <InfoItem
                        label="Màu nền"
                        value={
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="size-5 rounded border"
                              style={{
                                background: canvas.canvasBackground,
                              }}
                            />
                            {canvas.canvasBackground}
                          </span>
                        }
                      />
                      <InfoItem
                        label="Độ mờ nền"
                        value={`${Math.round(canvas.backgroundOpacity * 100)}%`}
                      />
                      <InfoItem
                        label="Chiều cao"
                        value={`${canvas.canvasHeight} px`}
                      />
                      {canvas.backgroundImageUrl && (
                        <div className="md:col-span-3 flex flex-col gap-2">
                          <span className="text-sm text-muted-foreground">
                            Ảnh nền
                          </span>
                          <img
                            src={canvas.backgroundImageUrl}
                            alt="Canvas background"
                            className="h-40 w-full rounded-md object-cover border"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="size-4" />
                Các tính năng nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.length > 0 ? (
                  features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="size-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">
                    Không có tính năng nào được cấu hình
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Quay lại danh sách
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "logs",
      title: "Lịch sử thao tác",
      icon: <History className="size-3.5" />,
      content: (
        <ActionLog
          entityName="TemplateEntity"
          entityId={data.id}
          title={`Lịch sử thao tác của template: ${data.name}`}
        />
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}

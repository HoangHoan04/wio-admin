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
  Star,
  Tag,
  Wrench,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
      ? data.features
          .split(/\r?\n/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      : Array.isArray(data.features?.list)
        ? data.features.list
        : [];

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
                  label="Tên mẫu theme"
                  value={getEnumName(enumData.THEME_CODE, data.themeCode)}
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

import { formatDateTime } from "@/common/helpers";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import { useTemplateDetail } from "@/hooks/template";
import { ArrowLeft, Layout } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useTemplateDetail(id);

  if (isLoading) {
    return (
      <BaseView>
        <div className="flex h-full items-center justify-center">
          <Spinner className="size-10 text-primary" />
        </div>
      </BaseView>
    );
  }

  if (!data) {
    return (
      <BaseView>
        <div className="flex h-full flex-col items-center justify-center gap-4">
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
            Quay lại danh sách
          </Button>
        </div>
      </BaseView>
    );
  }

  const tabs = [
    {
      key: "1",
      title: "Chi tiết template",
      icon: <Layout className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Tên template" value={data.name || "N/A"} />
                <InfoItem label="Slug" value={data.slug || "N/A"} />
                <InfoItem label="Mã theme" value={data.themeCode || "N/A"} />
                <InfoItem label="Mô tả" value={data.description || "N/A"} />
                <InfoItem label="Gói tối thiểu" value={data.minPlan || "N/A"} />
                <InfoItem
                  label="Ngày dùng thử"
                  value={
                    data.trialDays != null ? `${data.trialDays} ngày` : "N/A"
                  }
                />
                <InfoItem
                  label="Hiển thị"
                  value={
                    <StatusTag
                      severity={data.isShow ? "success" : "secondary"}
                      value={data.isShow ? "Có" : "Không"}
                    />
                  }
                />
                <InfoItem
                  label="Premium"
                  value={
                    <StatusTag
                      severity={data.isPremium ? "success" : "secondary"}
                      value={data.isPremium ? "Có" : "Không"}
                    />
                  }
                />
                <InfoItem
                  label="Ngày tạo"
                  value={formatDateTime(data.createdAt)}
                />
              </div>
            </CardContent>
          </Card>

          {data.tags && data.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-muted rounded-md border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-center gap-4">
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
        </div>
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
    </div>
  );
}

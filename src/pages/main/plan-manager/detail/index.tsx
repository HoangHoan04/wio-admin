import { formatDateTime } from "@/common/helpers";
import ActionLog from "@/components/layout/ActionLog";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import { useServicePlanDetail } from "@/hooks/service-plan";
import { ArrowLeft, Check, History, Package, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailPlanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useServicePlanDetail(id);

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
            Không tìm thấy thông tin gói dịch vụ
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

  const tabs = [
    {
      key: "detail",
      title: "Chi tiết gói dịch vụ",
      icon: <Package className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin gói dịch vụ: {data.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Tên gói" value={data.name} />
                <InfoItem
                  label="Đơn giá"
                  value={`${Number(data.priceVnd).toLocaleString("vi-VN")} VNĐ`}
                />
                <InfoItem
                  label="Thời hạn"
                  value={`${data.durationDays} ngày`}
                />
                <InfoItem
                  label="Số lượng khách tối đa"
                  value={`${data.maxGuests} khách`}
                />
                <InfoItem
                  label="Số lượng ảnh tối đa"
                  value={`${data.maxPhotos} ảnh`}
                />
                <InfoItem
                  label="Số lượng template tối đa"
                  value={`${data.maxTemplates} mẫu`}
                />
                <InfoItem
                  label="Tính năng AI"
                  value={
                    data.hasAi ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <Check className="size-4" /> Có hỗ trợ
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <X className="size-4" /> Không
                      </span>
                    )
                  }
                />
                <InfoItem
                  label="Tính năng Thống kê"
                  value={
                    data.hasAnalytics ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <Check className="size-4" /> Có hỗ trợ
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <X className="size-4" /> Không
                      </span>
                    )
                  }
                />
                <InfoItem
                  label="Slug tên miền tùy chỉnh"
                  value={
                    data.hasCustomSlug ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <Check className="size-4" /> Có hỗ trợ
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <X className="size-4" /> Không
                      </span>
                    )
                  }
                />
                <InfoItem
                  label="Trạng thái"
                  value={
                    <StatusTag
                      severity={data.isActive ? "success" : "secondary"}
                      value={
                        data.isActive ? "Đang hoạt động" : "Ngưng hoạt động"
                      }
                    />
                  }
                />
                <InfoItem
                  label="Ngày tạo"
                  value={data.createdAt ? formatDateTime(data.createdAt) : "—"}
                />
              </div>
            </CardContent>
          </Card>

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
    {
      key: "logs",
      title: "Lịch sử thao tác",
      icon: <History className="size-3.5" />,
      content: (
        <ActionLog
          entityName="ServicePlanEntity"
          entityId={data.id}
          title={`Lịch sử thao tác của gói dịch vụ: ${data.name}`}
        />
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}

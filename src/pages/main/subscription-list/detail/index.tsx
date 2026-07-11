import { formatDateTime } from "@/common/helpers";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import { useSubscriptionDetail } from "@/hooks/subscription";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailSubscriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSubscriptionDetail(id);

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
            Không tìm thấy thông tin subscription
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
      title: "Chi tiết subscription",
      icon: <CreditCard className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Gói dịch vụ" value={data.planName || "N/A"} />
                <InfoItem
                  label="Trạng thái"
                  value={
                    <StatusTag
                      severity={
                        data.status === "ACTIVE"
                          ? "success"
                          : data.status === "EXPIRED"
                            ? "danger"
                            : data.status === "CANCELLED"
                              ? "warning"
                              : "info"
                      }
                      value={data.status || "N/A"}
                    />
                  }
                />
                <InfoItem
                  label="Giá"
                  value={data.price ? `${data.price.toLocaleString()}₫` : "N/A"}
                />
                <InfoItem
                  label="Ngày bắt đầu"
                  value={
                    data.startDate ? formatDateTime(data.startDate) : "N/A"
                  }
                />
                <InfoItem
                  label="Ngày kết thúc"
                  value={data.endDate ? formatDateTime(data.endDate) : "N/A"}
                />
                <InfoItem
                  label="Ngày tạo"
                  value={formatDateTime(data.createdAt)}
                />
              </div>
            </CardContent>
          </Card>

          {data.user && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                  <InfoItem
                    label="Họ tên"
                    value={data.user.fullName || "N/A"}
                  />
                  <InfoItem label="Email" value={data.user.email || "N/A"} />
                  <InfoItem
                    label="Số điện thoại"
                    value={data.user.phone || "N/A"}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {data.wedding && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đám cưới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                  <InfoItem
                    label="Cặp đôi"
                    value={`${data.wedding.groomName} & ${data.wedding.brideName}`}
                  />
                  <InfoItem label="Slug" value={data.wedding.slug || "N/A"} />
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

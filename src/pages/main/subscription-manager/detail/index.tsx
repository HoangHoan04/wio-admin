import { formatDateTime } from "@/common/helpers";
import ActionLog from "@/components/layout/ActionLog";
import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import { useSubscriptionDetail } from "@/hooks/subscription";
import { ArrowLeft, CreditCard, Heart, History, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailSubscriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSubscriptionDetail(id);

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
            Không tìm thấy thông tin đăng ký dịch vụ
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
      key: "subscription-info",
      title: "Chi tiết đăng ký gói",
      icon: <CreditCard className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin gói dịch vụ & Đăng ký</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem
                  label="Tên gói dịch vụ"
                  value={data.plan?.name || "N/A"}
                />
                <InfoItem
                  label="Trạng thái đăng ký"
                  value={
                    <StatusTag
                      severity={
                        data.status === "ACTIVE"
                          ? "success"
                          : data.status === "PENDING"
                            ? "warning"
                            : "danger"
                      }
                      value={data.status}
                    />
                  }
                />
                <InfoItem
                  label="Số tiền đã thanh toán"
                  value={
                    data.paidAmountVnd
                      ? `${Number(data.paidAmountVnd).toLocaleString("vi-VN")} VNĐ`
                      : "0 VNĐ"
                  }
                />
                <InfoItem
                  label="Phương thức thanh toán"
                  value={data.paymentMethod || "N/A"}
                />
                <InfoItem
                  label="Mã tham chiếu thanh toán"
                  value={data.paymentRef || "N/A"}
                />
                <InfoItem
                  label="Thời gian bắt đầu"
                  value={
                    data.startedAt ? formatDateTime(data.startedAt) : "N/A"
                  }
                />
                <InfoItem
                  label="Thời gian hết hạn"
                  value={
                    data.expiresAt ? formatDateTime(data.expiresAt) : "N/A"
                  }
                />
                <InfoItem
                  label="Ngày tạo hệ thống"
                  value={
                    data.createdAt ? formatDateTime(data.createdAt) : "N/A"
                  }
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
      key: "customer-wedding-info",
      title: "Khách hàng & Đám cưới",
      icon: <User className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="size-5 text-blue-500" />
              <CardTitle>Thông tin Khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {data.user ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                  <InfoItem
                    label="Họ và tên"
                    value={data.user.fullName || "N/A"}
                  />
                  <InfoItem label="Email" value={data.user.email || "N/A"} />
                  <InfoItem
                    label="Số điện thoại"
                    value={data.user.phone || "N/A"}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Mã người dùng: {data.userId}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Heart className="size-5 text-pink-500" />
              <CardTitle>Thông tin Đám cưới</CardTitle>
            </CardHeader>
            <CardContent>
              {data.wedding ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                  <InfoItem
                    label="Tên chú rể"
                    value={data.wedding.groomName || "N/A"}
                  />
                  <InfoItem
                    label="Tên cô dâu"
                    value={data.wedding.brideName || "N/A"}
                  />
                  <InfoItem
                    label="Đường dẫn slug"
                    value={data.wedding.slug || "N/A"}
                  />
                  <InfoItem
                    label="Ngày cưới (Lễ thành hôn)"
                    value={
                      data.wedding.ceremonyAt
                        ? formatDateTime(data.wedding.ceremonyAt)
                        : "N/A"
                    }
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Mã đám cưới: {data.weddingId}
                </p>
              )}
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
          entityName="SubscriptionEntity"
          entityId={data.id}
          title={`Lịch sử thao tác của đăng ký subscription: ${data.id}`}
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

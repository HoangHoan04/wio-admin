import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import BaseView from "@/components/layout/BaseView";
import { formatDateTime } from "@/common/helpers";
import { useCustomerDetail } from "@/hooks/customer";
import type { ICustomer } from "@/dto/customer.dto";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, History, IdCard, User } from "lucide-react";

export default function DetailCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useCustomerDetail(id);

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
            Không tìm thấy thông tin người dùng
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
      title: "Chi tiết người dùng",
      icon: <IdCard className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Mã khách hàng" value={data.code || "N/A"} />
                <InfoItem label="Họ và tên" value={data.fullName || "N/A"} />
                <InfoItem label="Email liên hệ" value={data.email || "N/A"} />
                <InfoItem label="Số điện thoại" value={data.phone || "N/A"} />
                <InfoItem
                  label="Giới tính"
                  value={
                    data.gender === "MALE"
                      ? "Nam"
                      : data.gender === "FEMALE"
                        ? "Nữ"
                        : "Khác"
                  }
                />
                <InfoItem
                  label="Ngày sinh"
                  value={
                    data.dateOfBirth
                      ? formatDateTime(data.dateOfBirth)
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Ngày tạo hồ sơ"
                  value={formatDateTime(data.createdAt)}
                />
                <InfoItem
                  label="Trạng thái hồ sơ"
                  value={
                    <StatusTag
                      severity={!data.isDeleted ? "success" : "danger"}
                      value={
                        !data.isDeleted ? "Hoạt động" : "Đã xóa / Đình chỉ"
                      }
                    />
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
              Thoát
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      title: "Thông tin tài khoản",
      icon: <User className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Tài khoản & Phân quyền</CardTitle>
            </CardHeader>
            <CardContent>
              {!data.user ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  Khách hàng này chưa kích hoạt tài khoản hệ thống (User bypass).
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                  <InfoItem
                    label="Vai trò (Role)"
                    value={
                      <span
                        className={
                          data.user.isAdmin
                            ? "text-orange-500 font-semibold"
                            : "text-blue-500 font-semibold"
                        }
                      >
                        {data.user.isAdmin ? "Admin" : "Customer"}
                      </span>
                    }
                  />
                  <InfoItem
                    label="Xác thực tài khoản"
                    value={
                      <StatusTag
                        severity={data.user.isActive ? "success" : "secondary"}
                        value={
                          data.user.isActive ? "Đã kích hoạt" : "Chưa kích hoạt"
                        }
                      />
                    }
                  />
                  <InfoItem
                    label="Đăng nhập từ"
                    value={getProviderName(data.user)}
                  />
                  <InfoItem
                    label="Lần đăng nhập cuối"
                    value={
                      data.user.lastLogin
                        ? formatDateTime(data.user.lastLogin)
                        : "Chưa có dữ liệu"
                    }
                  />
                </div>
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
              Thoát
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      title: "Lịch sử thao tác",
      icon: <History className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Lịch sử thao tác của người dùng: {data.fullName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tính năng đang phát triển...
              </p>
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
              Thoát
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}

const providerLabels: Record<string, string> = {
  googleId: "Google",
  facebookId: "Facebook",
  zaloId: "Zalo",
};

function getProviderName(user: ICustomer["user"]) {
  if (!user) return "N/A";
  for (const [key, label] of Object.entries(providerLabels)) {
    if ((user as any)[key]) return label;
  }
  return "Local (Email/Pass)";
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
    </div>
  );
}

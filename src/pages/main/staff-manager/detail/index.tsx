import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { ArrowLeft, UserCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailStaffPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const staffData = {
    id: id || "1",
    fullName: "Phạm Văn D",
    email: "nhanvien1@tiemcuoi.com",
    phone: "0912345678",
    role: "SUPPORT_STAFF",
    status: "ACTIVE",
    createdAt: "2026-03-15",
  };

  const tabs = [
    {
      key: "detail",
      title: "Chi tiết nhân sự",
      icon: <UserCheck className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Hồ sơ nhân sự #{staffData.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Họ và tên" value={staffData.fullName} />
                <InfoItem label="Email" value={staffData.email} />
                <InfoItem label="Số điện thoại" value={staffData.phone} />
                <InfoItem label="Vai trò hệ thống" value={staffData.role} />
                <InfoItem
                  label="Trạng thái tài khoản"
                  value={
                    <StatusTag
                      severity="success"
                      value="Hoạt động"
                    />
                  }
                />
                <InfoItem label="Ngày tạo hồ sơ" value={staffData.createdAt} />
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
